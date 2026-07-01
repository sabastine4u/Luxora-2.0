import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import MarketTrends from './components/MarketTrends';
import ROICalculator from './components/ROICalculator';
import RentalYield from './components/RentalYield';
import GrowthForecast from './components/GrowthForecast';
import NeighborhoodInsights from './components/NeighborhoodInsights';
import HeatMap from './components/HeatMap';
import ComparableProperties from './components/ComparableProperties';

export default function IntelligenceDashboardPage() {
  const [activeTab, setActiveTab] = useState('Market Trends');

  const renderContent = () => {
    switch (activeTab) {
      case 'Market Trends': return <MarketTrends />;
      case 'ROI Calculator': return <ROICalculator />;
      case 'Rental Yield': return <RentalYield />;
      case 'Growth Forecast': return <GrowthForecast />;
      case 'Neighborhood Insights': return <NeighborhoodInsights />;
      case 'Heat Map': return <HeatMap />;
      case 'Comparable Properties': return <ComparableProperties />;
      default: return <MarketTrends />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
