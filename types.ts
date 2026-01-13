import React from 'react';

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  REAL_ESTATE = 'REAL_ESTATE',
  PORTFOLIO = 'PORTFOLIO',
  TREASURY = 'TREASURY'
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export interface AssetData {
  name: string;
  value: number;
}

export interface PerformanceData {
  month: string;
  portfolio: number;
  benchmark: number;
}

export interface RealEstateAsset {
  id: string;
  name: string;
  value: string;
  yield: string;
  status: 'Occupado' | 'En Construcción' | 'Disponible';
  occupancy: number;
  location: string;
  image?: string;
}