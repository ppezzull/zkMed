/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bar, Line, Doughnut, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

/* -------------------------------------------------------------------------- */
/*                              ⛽ Mocked dataset                              */
/* -------------------------------------------------------------------------- */
const pool = {
  assets: [
    {
      symbol: 'USDC',
      availableLiquidity: 1_200_000,
      tvl: 2_500_000,
      totalBorrowed: 1_300_000,
      supplyApy: 3.25,
      borrowApy: 4.75,
      collateralFactor: 80,
      liquidationThreshold: 85,
      debtCeiling: 2_000_000,
    },
    {
      symbol: 'EURC',
      availableLiquidity: 800_000,
      tvl: 1_500_000,
      totalBorrowed: 700_000,
      supplyApy: 2.75,
      borrowApy: 4.2,
      collateralFactor: 75,
      liquidationThreshold: 80,
      debtCeiling: 1_200_000,
    },
  ],
  revenueSeries: [
    { date: '2025‑07‑01', revenue: 2_300 },
    { date: '2025‑07‑02', revenue: 4_700 },
    { date: '2025‑07‑03', revenue: 6_200 },
    { date: '2025‑07‑04', revenue: 8_100 },
    { date: '2025‑07‑05', revenue: 9_400 },
    { date: '2025‑07‑06', revenue: 12_300 },
    { date: '2025‑07‑07', revenue: 14_500 },
  ],
  healthFactorBuckets: {
    safe: 92,
    risky: 6,
    liquidatable: 2,
  },
} as const;

/* ---------------------- 🌐 Derived helper structures ---------------------- */

const assetLabels = pool.assets.map((a) => a.symbol);
const numberFmt = (n: number) =>
  Intl.NumberFormat('en', { notation: 'compact' }).format(n);

/* -------------------------------------------------------------------------- */
/*                                  Page                                      */
/* -------------------------------------------------------------------------- */
export default function PoolDashboard() {
  return (
    <section className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        StableWallet Liquidity Pool
      </h1>

      {/* 1️⃣ Overview bar chart ------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Overview</CardTitle>
          <CardDescription>
            Available liquidity, total borrowed &amp; TVL per asset
          </CardDescription>
        </CardHeader>

        <CardContent className="h-96">
          <Bar
            data={{
              labels: assetLabels,
              datasets: [
                {
                  label: 'Available Liquidity',
                  data: pool.assets.map((a) => a.availableLiquidity),
                  backgroundColor: '#a5b4fc',
                },
                {
                  label: 'Total Borrowed',
                  data: pool.assets.map((a) => a.totalBorrowed),
                  backgroundColor: '#fcd34d',
                },
                {
                  label: 'TVL',
                  data: pool.assets.map((a) => a.tvl),
                  backgroundColor: '#34d399',
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: $${numberFmt(ctx.parsed.y)}` } } },
              scales: { y: { ticks: { callback: (v) => `$${numberFmt(+v)}` } } },
            }}
          />
        </CardContent>
      </Card>

      {/* 2️⃣ APY dual‑axis chart -------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Current APYs per Asset</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Line
            data={{
              labels: assetLabels,
              datasets: [
                {
                  label: 'Supply APY',
                  data: pool.assets.map((a) => a.supplyApy),
                  borderWidth: 2,
                  tension: 0.4,
                },
                {
                  label: 'Borrow APY',
                  data: pool.assets.map((a) => a.borrowApy),
                  borderWidth: 2,
                  borderDash: [6, 6],
                  tension: 0.4,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: { y: { ticks: { callback: (v) => `${v}%` } } },
            }}
          />
        </CardContent>
      </Card>

      {/* 3️⃣ Utilisation gauges + factors ------------------------------------ */}
      <Tabs defaultValue="usdc">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          {assetLabels.map((sym) => (
            <TabsTrigger key={sym} value={sym.toLowerCase()}>
              {sym}
            </TabsTrigger>
          ))}
        </TabsList>

        {pool.assets.map((a) => {
          const utilisation = +(a.totalBorrowed / a.tvl * 100).toFixed(2);
          return (
            <TabsContent key={a.symbol} value={a.symbol.toLowerCase()}>
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Gauge simulated with doughnut: borrowed vs free */}
                <Card className="sm:col-span-1">
                  <CardHeader>
                    <CardTitle>Utilization</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <Doughnut
                      data={{
                        labels: ['Borrowed', 'Available'],
                        datasets: [
                          {
                            data: [a.totalBorrowed, a.availableLiquidity],
                            backgroundColor: ['#fb7185', '#d1d5db'],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (ctx) =>
                                `${ctx.label}: $${numberFmt(ctx.parsed)} `,
                            },
                          },
                          legend: { display: false },
                        },
                        cutout: '60%',
                      }}
                    />
                    <p className="text-center text-xl font-semibold mt-2">
                      {utilisation}%
                    </p>
                  </CardContent>
                </Card>

                {/* Collateral vs liquidation thresholds */}
                <Card className="sm:col-span-2">
                  <CardHeader>
                    <CardTitle>Collateral Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <Scatter
                      data={{
                        datasets: [
                          {
                            label: a.symbol,
                            data: [
                              {
                                x: a.collateralFactor,
                                y: a.liquidationThreshold,
                              },
                            ],
                            pointRadius: 10,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            title: { display: true, text: 'Collateral Factor (LTV %)' },
                            min: 50,
                            max: 100,
                          },
                          y: {
                            title: { display: true, text: 'Liquidation Threshold (%)' },
                            min: 50,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* 4️⃣ Debt ceiling progress bars -------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Debt Ceiling (Isolation Mode)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pool.assets.map((a) => {
            const pct = +(a.totalBorrowed / a.debtCeiling * 100).toFixed(2);
            return (
              <div key={a.symbol}>
                <p className="mb-1 text-sm font-medium">
                  {a.symbol}: ${numberFmt(a.totalBorrowed)} / $
                  {numberFmt(a.debtCeiling)} ({pct}%)
                </p>
                <div className="w-full h-3 rounded bg-muted">
                  <div
                    className="h-3 rounded bg-primary"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 5️⃣ Protocol revenue line chart ------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Revenue</CardTitle>
          <CardDescription>Cumulative fees earned (USD)</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <Line
            data={{
              labels: pool.revenueSeries.map((p) => p.date),
              datasets: [
                {
                  label: 'Revenue',
                  data: pool.revenueSeries.map((p) => p.revenue),
                  borderWidth: 2,
                  tension: 0.3,
                  fill: true,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  ticks: { callback: (v) => `$${numberFmt(+v)}` },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* 6️⃣ Health factor distribution -------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Health Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <Doughnut
            data={{
              labels: ['Safe (>1)', 'Risky (≈1)', 'Liquidatable (<1)'],
              datasets: [
                {
                  data: Object.values(pool.healthFactorBuckets),
                  backgroundColor: ['#34d399', '#f97316', '#ef4444'],
                  borderWidth: 0,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
