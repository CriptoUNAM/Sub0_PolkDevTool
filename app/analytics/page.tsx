'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Code, 
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Clock,
  Star,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';

// Mock data para el demo
const ANALYTICS_DATA = {
  totalContracts: 1247,
  totalUsers: 3421,
  totalStaked: 1250000,
  apy: 10.5,
  successRate: 98.7,
  avgGenerationTime: 2.3,
  popularFeatures: [
    { name: 'AI Generator', usage: 85, color: 'from-purple-500 to-pink-500' },
    { name: 'Templates', usage: 72, color: 'from-blue-500 to-cyan-500' },
    { name: 'Debug Tool', usage: 68, color: 'from-green-500 to-emerald-500' },
    { name: 'Deploy Assistant', usage: 54, color: 'from-yellow-500 to-orange-500' },
  ],
  recentActivity: [
    { type: 'contract_generated', user: '0x1234...5678', time: '2 min ago', amount: 'Staking Contract' },
    { type: 'stake', user: '0x2345...6789', time: '5 min ago', amount: '1,500 Tokens' },
    { type: 'deploy', user: '0x3456...7890', time: '8 min ago', amount: 'NFT Contract' },
    { type: 'claim', user: '0x4567...8901', time: '12 min ago', amount: '45.67 Tokens' },
  ],
  performance: {
    contractsGenerated: 1247,
    deploymentSuccess: 98.7,
    avgGasUsed: 2.3,
    totalVolume: 1250000,
  }
};

export default function AnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular refresh de datos
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const timeframes = [
    { value: '1h', label: '1 Hora' },
    { value: '24h', label: '24 Horas' },
    { value: '7d', label: '7 Días' },
    { value: '30d', label: '30 Días' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <BarChart3 className="w-12 h-12 text-purple-400 mr-4" />
              <h1 className="text-5xl font-bold gradient-text">Analytics Dashboard</h1>
            </div>
            <p className="text-2xl text-gray-300 mb-8">
              Métricas en tiempo real del ecosistema Polkadot DevKit
            </p>
            
            <div className="flex justify-center gap-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {timeframes.map(timeframe => (
                  <option key={timeframe.value} value={timeframe.value} className="bg-slate-900">
                    {timeframe.label}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="secondary"
              >
                {isRefreshing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Actualizar
              </Button>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {ANALYTICS_DATA.totalContracts.toLocaleString()}
              </h3>
              <p className="text-gray-400 text-sm">Contratos Generados</p>
              <div className="mt-2 text-green-400 text-sm flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% vs ayer
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {ANALYTICS_DATA.totalUsers.toLocaleString()}
              </h3>
              <p className="text-gray-400 text-sm">Usuarios Activos</p>
              <div className="mt-2 text-blue-400 text-sm flex items-center">
                <Users className="w-3 h-3 mr-1" />
                +8.3% vs ayer
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {ANALYTICS_DATA.totalStaked.toLocaleString()}
              </h3>
              <p className="text-gray-400 text-sm">Total Staked</p>
              <div className="mt-2 text-green-400 text-sm flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                {ANALYTICS_DATA.apy}% APY
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {ANALYTICS_DATA.successRate}%
              </h3>
              <p className="text-gray-400 text-sm">Tasa de Éxito</p>
              <div className="mt-2 text-yellow-400 text-sm flex items-center">
                <Award className="w-3 h-3 mr-1" />
                Excelente
              </div>
            </Card>
          </motion.div>

          {/* Charts and Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Popular Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <PieChart className="w-6 h-6 mr-2 text-purple-400" />
                  Características Populares
                </h3>
                <div className="space-y-4">
                  {ANALYTICS_DATA.popularFeatures.map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">{feature.name}</span>
                        <span className="text-sm text-gray-400">{feature.usage}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${feature.color}`}
                          style={{ width: `${feature.usage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <LineChart className="w-6 h-6 mr-2 text-blue-400" />
                  Métricas de Rendimiento
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Code className="w-5 h-5 text-purple-400 mr-3" />
                      <span className="text-sm text-gray-300">Contratos Generados</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {ANALYTICS_DATA.performance.contractsGenerated.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-300">Éxito de Deployment</span>
                    </div>
                    <span className="text-lg font-bold text-green-400">
                      {ANALYTICS_DATA.performance.deploymentSuccess}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                      <span className="text-sm text-gray-300">Gas Promedio</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">
                      {ANALYTICS_DATA.performance.avgGasUsed}M
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="text-sm text-gray-300">Volumen Total</span>
                    </div>
                    <span className="text-lg font-bold text-blue-400">
                      {ANALYTICS_DATA.performance.totalVolume.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <Card>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-400" />
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {ANALYTICS_DATA.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                      <div>
                        <span className="text-sm text-gray-300">
                          {activity.user} {activity.type === 'contract_generated' ? 'generó' : 
                           activity.type === 'stake' ? 'stakeó' :
                           activity.type === 'deploy' ? 'desplegó' : 'reclamó'}
                        </span>
                        <span className="text-sm text-gray-400 ml-2">{activity.amount}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Exportar Datos</h3>
              <p className="text-gray-400 mb-6">
                Descarga los datos de analytics en diferentes formatos
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
                <Button variant="secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
