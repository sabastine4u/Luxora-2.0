// Format a backend numeric Property price into a frontend display string.
const formatPropertyPrice = (price, currency = 'NGN') => {
  // Return a clear fallback when no public price is available.
  if (price === null || price === undefined) {
    return 'Price on Request';
  }

  // Format the Property price using the backend currency.
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};


// Format the backend Property size into the frontend area display string.
const formatPropertyArea = (
  propertySize,
  propertySizeUnit = 'sqm',
) => {
  // Return a clear fallback when no physical size is available.
  if (propertySize === null || propertySize === undefined) {
    return 'Size unavailable';
  }

  // Format the physical size together with its unit.
  return `${Number(propertySize).toLocaleString()} ${propertySizeUnit}`;
};

// Build the location string used by existing Property cards and listings.
const buildPropertyLocation = (property) => {
  // Prefer the most specific location fields available.
  const locationParts = [
    property.area,
    property.city,
    property.state,
  ].filter(Boolean);

  // Return a usable location or fall back to the country.
  return (
    locationParts.join(', ') ||
    property.country ||
    'Location unavailable'
  );
};

// Convert the backend verification level into the frontend verified array.
const mapVerificationLevel = (verificationLevel) => {
  // Unverified Properties should have no verification badges.
  if (
    !verificationLevel ||
    verificationLevel === 'Unverified'
  ) {
    return [];
  }

  // Preserve the backend verification label for the existing frontend.
  return [verificationLevel];
};

// Convert the backend lifecycle state into the current frontend status representation.
const mapPropertyStatus = (status) => {
  // Published Properties are visible in the public marketplace.
  if (status === 'Published') {
    return 'Available';
  }

  // Preserve the Under Offer state.
  if (status === 'Under Offer') {
    return 'Under Offer';
  }

  // Preserve a completed sale.
  if (status === 'Sold') {
    return 'Sold';
  }

  // Preserve a completed rental.
  if (status === 'Rented') {
    return 'Rented';
  }

  // Preserve Draft for internal consumers.
  if (status === 'Draft') {
    return 'Draft';
  }

  // Map review states to the frontend Pending state.
  if (
    status === 'Pending Review' ||
    status === 'Approved'
  ) {
    return 'Pending';
  }

  // Preserve Archived Properties.
  if (status === 'Archived') {
    return 'Archived';
  }

  // Use Pending as the safest fallback.
  return 'Pending';
};

// Convert the backend inspection state into the frontend inspection state.
const mapInspectionStatus = (inspectionStatus) => {
  // A completed inspection is represented as Passed in the frontend.
  if (inspectionStatus === 'Completed') {
    return 'Passed';
  }

  // A failed inspection remains Failed.
  if (inspectionStatus === 'Failed') {
    return 'Failed';
  }

  // Not scheduled, scheduled, and in-progress are all Pending to the UI.
  return 'Pending';
};

// Convert backend payment plans into the existing frontend payment option strings.
const mapPaymentOptions = (paymentPlans = []) => {
  // Ensure that invalid or missing backend data cannot break the mapper.
  if (!Array.isArray(paymentPlans)) {
    return [];
  }

  // Convert each structured backend plan into the frontend format.
  return paymentPlans.map((plan) => {
    // Prefer the explicit duration when it exists.
    if (plan.durationMonths) {
      return `${plan.durationMonths} Months Plan`;
    }

    // Fall back to the plan description.
    return plan.description || 'Payment Plan';
  });
};

// Build the frontend monthly price field from the backend pricing structure.
const mapMonthlyPrice = (property) => {
  // A monthly price can be displayed directly when the backend says it is monthly.
  if (
    property.priceFrequency === 'monthly' &&
    property.price !== null &&
    property.price !== undefined
  ) {
    return formatPropertyPrice(
      property.price,
      property.currency,
    );
  }

  // A yearly rental amount can be converted into an approximate monthly display.
  if (
    property.priceFrequency === 'yearly' &&
    property.transactionType === 'rent' &&
    property.price !== null &&
    property.price !== undefined
  ) {
    return formatPropertyPrice(
      property.price / 12,
      property.currency,
    );
  }

  // The current frontend requires a monthly string even when pricing is not monthly.
  return 'Price details available';
};

// Convert one backend Property object into the existing frontend Property shape.
export const mapApiPropertyToProperty = (property) => {
  // Prefer the explicit cover image, then the first gallery image.
  const image =
    property.coverImage ||
    property.images?.[0] ||
    '';

  // Extract the Agent's real public name from the populated User.
  const agentName =
    property.agent?.user?.fullName ||
    'Luxora Agent';

  // Extract the Agency's public name from the populated Agency.
  const agencyName =
    property.agency?.name ||
    'Luxora';

  // Determine whether mortgage support is available.
  const mortgageSupport =
    property.mortgageOptions?.available === true;

  // Determine whether the Property has completed physical verification.
  const agentVerified =
    property.verificationLevel ===
    'Physical Inspection Completed';

  // Return the shape expected by the current frontend Property type.
  return {
    // Map MongoDB _id to the frontend id field.
    id: property._id,

    // Preserve the canonical transaction type.
    transactionType: property.transactionType,

        // Preserve the backend pricing condition for accurate frontend display.
    priceType: property.priceType,

    // Preserve the backend pricing frequency for accurate frontend display.
    priceFrequency: property.priceFrequency,

    // Preserve the backend currency used by the Property.
    currency: property.currency || 'NGN',


    // Preserve the public Property title.
    title: property.title,

    // Preserve the Property description.
    description: property.description || '',

    // Build the display location.
    location: buildPropertyLocation(property),

    // Preserve canonical city and state values.
    city: property.city || '',
    state: property.state || '',

    // Format the public display price.
    price: formatPropertyPrice(
      property.price,
      property.currency,
    ),

    // Preserve the raw numeric Property price.
    priceValue: property.price ?? 0,

    // Provide the frontend's price-period display value.
    monthly: mapMonthlyPrice(property),

    // Map the backend Property category.
    type: property.propertyType,

    // Map room counts to the frontend names.
    beds: property.bedrooms ?? 0,
    baths: property.bathrooms ?? 0,

    // Map physical Property size to the existing area display field.
    area: formatPropertyArea(
      property.propertySize,
      property.propertySizeUnit,
    ),

    // Use the Property's primary image.
    image,

    // Map verification information.
    verified: mapVerificationLevel(
      property.verificationLevel,
    ),

    // Map public Agent information.
    agent: {
      name: agentName,
      agency: agencyName,
      avatar: '',
      id: property.agent?._id,
      email: property.agent?.user?.email,
      verified: agentVerified,
    },

    // Preserve the Property gallery.
    gallery: property.images || [],

    // Preserve Property amenities.
    amenities: property.amenities || [],

    // Preserve physical Property information.
    parkingSpaces: property.parkingSpaces,
    yearBuilt: property.yearBuilt,
    floorPlans: property.floorPlans || [],

    // Convert backend coordinates into the frontend structure.
    coordinates:
      property.coordinates?.latitude !== null &&
      property.coordinates?.latitude !== undefined &&
      property.coordinates?.longitude !== null &&
      property.coordinates?.longitude !== undefined
        ? {
            lat: property.coordinates.latitude,
            lng: property.coordinates.longitude,
          }
        : undefined,

    // Preserve marketplace metadata.
    listingTier: property.listingTier,
    featuredLevel: property.featuredLevel,

    // Preserve optional media URLs.
    virtualTourUrl:
      property.virtualTourUrl || undefined,
    videoUrl:
      property.videoUrl || undefined,
    brochureUrl:
      property.brochureUrl || undefined,

    // Preserve furnishing information.
    furnishing:
      property.furnishing || undefined,

   // Map the backend lifecycle state into the existing frontend status field.
status: mapPropertyStatus(property.status),
    // Map backend mortgage availability.
    mortgageSupport,

    // Map backend inspection state.
    inspectionStatus: mapInspectionStatus(
      property.inspectionStatus,
    ),

    // Preserve the backend availability date.
    availabilityDate:
      property.availabilityDate || undefined,

    // Convert structured backend payment plans.
    paymentOptions: mapPaymentOptions(
      property.paymentPlans,
    ),

    // Preserve document metadata currently supported by the frontend.
    documents: (property.documents || []).map(
      (document) => ({
        title: document.title,
        verified: Boolean(document.verified),
      }),
    ),

    // Preserve relationship identifiers.
    ownerId: property.owner || undefined,
    agentId: property.agent?._id || undefined,
    agencyId: property.agency?._id || undefined,

    // Preserve creator metadata.
    createdBy: property.createdBy,
    createdByRole: property.createdByRole,
    origin: property.origin,

    // Preserve backend timestamps.
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
};

// Convert a backend Property collection into frontend Property objects.
export const mapApiPropertiesToProperties = (
  properties = [],
) => {
  // Return an empty array when no Property collection was supplied.
  if (!Array.isArray(properties)) {
    return [];
  }

  // Map every backend Property through the single-property mapper.
  return properties.map(mapApiPropertyToProperty);
};

