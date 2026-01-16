import React from 'react';
import { LucideIcon } from 'lucide-react';

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

export interface KPICardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  trend?: string;
}

export interface AssetData {
  name: string;
  value: number;
  [key: string]: any;
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

export interface PortfolioHolding {
  ticker: string;
  name: string;
  type: 'ETF' | 'Equity' | 'Fund' | 'Bond' | 'Crypto';
  value: string;
  change: string;
}

export interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload: any;
  dataKey: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}