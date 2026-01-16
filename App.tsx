import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/Dashboard';
import { RealEstate } from './components/RealEstate';
import { Portfolio } from './components/Portfolio';
import { Treasury } from './components/Treasury';
import { PrivateEquity } from './components/PrivateEquity';
import { Environmental } from './components/Environmental';
import { FamilyBusiness } from './components/FamilyBusiness';
import { RiskManagement } from './components/RiskManagement';
import { PassionAssets } from './components/PassionAssets';
import { Philanthropy } from './components/Philanthropy';
import { Reporting } from './components/Reporting';
import { Crypto } from './components/Crypto';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="family-business" element={<FamilyBusiness />} />
          <Route path="real-estate" element={<RealEstate />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="treasury" element={<Treasury />} />
          <Route path="private-equity" element={<PrivateEquity />} />
          <Route path="environmental" element={<Environmental />} />
          <Route path="crypto" element={<Crypto />} />
          <Route path="risk-management" element={<RiskManagement />} />
          <Route path="passion-assets" element={<PassionAssets />} />
          <Route path="philanthropy" element={<Philanthropy />} />
          <Route path="reporting" element={<Reporting />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
