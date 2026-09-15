export function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return name ? `${timeGreeting}, ${name} 👋` : `${timeGreeting} 👋`;
}

// Same time-based greeting as getGreeting(), but without the emoji baked
// into the string. Use this alongside the <WaveEmoji /> component when the
// emoji needs to animate on its own rather than sit inside plain text.
export function getGreetingText(name?: string): string {
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return name ? `${timeGreeting}, ${name}` : timeGreeting;
}