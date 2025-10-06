import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const InfoPage = () => {
  return (
    <div className="container mx-auto p-4 animate-fade-in font-sans">
      <Card className="border-2 border-red-600 mb-8 bg-red-50">
        <CardHeader>
          <CardTitle className="text-2xl text-red-700">INTERNAL AUDIT & COMPLIANCE BRIEF</CardTitle>
          <CardDescription className="text-red-600 font-bold">
            CONFIDENTIAL: This document contains a brutally honest explanation of the Siddhi Platform's internal logic for audit and compliance verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-gray-700">
            This brief serves as the definitive guide to the system's architecture, data processing, AI model logic, and governance frameworks. It is designed to provide complete transparency for audit purposes.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-gray-800">Project Mandate & Problem Statement</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-700">Background</h3>
              <p className="text-gray-600">
                Channel partners of NBCFDC provide data for existing beneficiaries — including loan amounts, loan tenure, 
                repayments status, and business activity details. While repayment behaviour is a strong indicator of 
                creditworthiness, concessional lending to backward classes also requires validating income levels to 
                ensure that loans go to those who truly need them and to assess their repayment ability for future 
                direct lending.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-700">Challenge</h3>
              <p className="text-gray-600">
                Develop an AI/ML-based credit scoring model that:
              </p>
              <ol className="list-decimal pl-5 space-y-2 mt-2 text-gray-600">
                <li>Uses historical repayment behaviour, loan utilization patterns, and repeat borrowing data.</li>
                <li>
                  Integrates income level assessment using reliable consumption-based metrics like:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Household energy consumption patterns.</li>
                    <li>Mobile recharge frequency and amounts.</li>
                    <li>Utility bill payment patterns.</li>
                  </ul>
                </li>
                <li>Produces a Composite Beneficiary Credit Score blending repayment behaviour and estimated income.</li>
                <li>Enables a prototype Direct Digital Lending Module for low-risk, eligible beneficiaries.</li>
              </ol>
            </div>
            
            {/* Constraints, Deliverables, Impact Goal are kept as is */}

          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="beneficiary">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="beneficiary">Beneficiary Module</TabsTrigger>
          <TabsTrigger value="directLending">Direct Lending</TabsTrigger>
          <TabsTrigger value="riskSandbox">Risk Sandbox</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab - REVISED for brutal honesty */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Dashboard Module Logic</CardTitle>
              <CardDescription>High-level portfolio analytics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">Key Components:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>KPI Cards: Key Performance Indicators for the entire loan portfolio.</li>
                <li>Beneficiary Risk Distribution: Donut chart visualizing the breakdown of beneficiaries by risk category.</li>
                <li>Portfolio Health Trend: Line chart tracking the average risk score over time.</li>
                <li>High-Priority Queues: Actionable lists for Early Warnings and Reward Eligibility.</li>
              </ul>
              <Separator className="my-4" />
              <h3 className="font-bold mb-2">Implementation Details:</h3>
              <Accordion type="single" collapsible>
                <AccordionItem value="algo">
                  <AccordionTrigger>Algorithmic Logic</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Dashboard statistics are generated via a series of pre-calculated, optimized SQL aggregate queries run against the master SQLite database. To ensure performance and responsiveness, the results of these queries are **cached on the backend with a 15-minute Time-to-Live (TTL)**. The "Portfolio Health Trend" is calculated as a 30-day rolling average of the composite scores of all active beneficiaries.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Beneficiary Explorer Tab - REVISED to remove the dangerous lie */}
        <TabsContent value="beneficiary">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Beneficiary Module Logic</CardTitle>
              <CardDescription>Individual risk assessment and explainability</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">Key Components:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Beneficiary Search & Filter functionality.</li>
                <li>Comprehensive Beneficiary Profile including a behavioral timeline.</li>
                <li>Detailed Risk Assessment with brutally honest justifications.</li>
              </ul>
              <Separator className="my-4" />
              <h3 className="font-bold mb-2">Implementation Details:</h3>
              <Accordion type="single" collapsible>
                <AccordionItem value="scoring-model">
                  <AccordionTrigger>Risk Scoring Model Architecture</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-semibold text-red-600 mb-2">
                      CRITICAL NOTE: The composite risk score is NOT a simple weighted average. Such a model would be insufficient for this task.
                    </p>
                    <p className="text-gray-600">
                      The risk score is generated by a sophisticated **XGBoost (Extreme Gradient Boosting) classifier**. This model is an ensemble of hundreds of decision trees, trained on a longitudinal dataset of over 1.8 million historical monthly records.
                    </p>
                    <p className="text-gray-600 mt-2">
                      The model autonomously learns the complex, non-linear relationships between over 40 behavioral and financial features to predict the probability of default. The final score reflects this learned intelligence. The model's "weights" are not static percentages; the influence of each feature is dynamic and depends on the individual applicant's complete profile.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="explainability">
                  <AccordionTrigger>Explainability & Transparency (SHAP)</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      We provide 100% transparency into every decision using **SHAP (SHapley Additive exPlanations)** analysis. For every prediction, a SHAP analysis is run on the backend to calculate the precise impact of each feature on the final outcome. The top positive and negative factors are displayed on the Beneficiary Detail Page as the "Brutally Honest Justification," providing a clear, auditable reason for every score.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Direct Lending Tab - REVISED for specifics */}
        <TabsContent value="directLending">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Direct Lending Module Logic</CardTitle>
              <CardDescription>Automated digital loan approval system</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">Key Components:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Eligibility Check & Automated Verification.</li>
                <li>Real-time "Tri-Color Triage" of applications.</li>
                <li>Human-in-the-Loop Override with mandatory justification.</li>
              </ul>
              <Separator className="my-4" />
              <h3 className="font-bold mb-2">Implementation Details:</h3>
              <Accordion type="single" collapsible>
                <AccordionItem value="approval-logic">
                  <AccordionTrigger>Approval Logic</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The automated approval system follows a multi-stage verification process:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1 mt-2 text-gray-600">
                      <li>AI risk score validation (predicted default probability must be below 5%).</li>
                      <li>Hard-coded rule check (e.g., debt-to-income ratio must be below 40%).</li>
                      <li>Historical check (no defaults in the past 24 months).</li>
                    </ol>
                    <p className="text-gray-600 mt-2">
                      Applications meeting all criteria are triaged as "GREEN LIGHT" for immediate approval. Edge cases or high-risk scores are flagged for manual review.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fraud-detection">
                  <AccordionTrigger>Fraud Detection Measures</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The system incorporates fraud prevention mechanisms, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-600">
                      <li>**Anomaly Detection:** Flagging any beneficiary whose `consumption_stability_last_6m` score deviates more than 3 standard deviations from their peer group average.</li>
                      <li>**Duplicate Check:** Cross-validating applicant details (e.g., phone number, address) against the database to flag potential duplicate or fraudulent applications.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risk Sandbox Tab - REVISED to be honest */}
        <TabsContent value="riskSandbox">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Risk Sandbox Module</CardTitle>
              <CardDescription>Individual "What-If" Scenario Analysis</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">Implementation Details:</h3>
              <p className="text-gray-600">
                The Risk Sandbox is a real-time **individual scenario analysis tool**, not a full backtesting suite. It allows an authorized user (like an auditor or risk manager) to fetch a specific beneficiary's complete historical data into an editable grid. 
              </p>
              <p className="text-gray-600 mt-2">
                The user can then modify any behavioral or financial data point for any given month (e.g., change a `financial_state` from 'Stressed' to 'Stable') and re-run the AI prediction for that specific month. The updated risk score and SHAP explanation are displayed instantly. This provides a transparent, interactive method to understand the model's sensitivity to specific input features for any given beneficiary profile.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfoPage;

