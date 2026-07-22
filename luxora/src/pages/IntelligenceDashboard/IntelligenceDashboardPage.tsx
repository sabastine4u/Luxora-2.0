import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import MarketTrends from './components/MarketTrends';
import ROICalculator from './components/ROICalculator';
import RentalYield from './components/RentalYield';
import GrowthForecast from './components/GrowthForecast';
import NeighborhoodInsights from './components/NeighborhoodInsights';
import HeatMap from './components/HeatMap';
import ComparableProperties from './components/ComparableProperties';
import Overview from './components/Overview';
import Messages from './components/Messages';
import Settings from './components/Settings';
import InvestmentScoring from './components/InvestmentScoring';
import RiskAnalysis from './components/RiskAnalysis';
import ExecutiveReports from './components/ExecutiveReports';
import AIInsights from './components/AIInsights';
import MarketAlerts from './components/MarketAlerts';

export default function IntelligenceDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Messages': return <Messages />;
      case 'Market Trends': return <MarketTrends />;
      case 'ROI Calculator': return <ROICalculator />;
      case 'Rental Yield': return <RentalYield />;
      case 'Growth Forecast': return <GrowthForecast />;
      case 'Neighborhood Insights': return <NeighborhoodInsights />;
      case 'Heat Map': return <HeatMap />;
      case 'Comparable Properties': return <ComparableProperties />;
      case 'Investment Scoring': return <InvestmentScoring />;
      case 'Risk Analysis': return <RiskAnalysis />;
      case 'AI Insights': return <AIInsights />;
      case 'Executive Reports': return <ExecutiveReports />;
      case 'Market Alerts': return <MarketAlerts />;
      case 'Settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
