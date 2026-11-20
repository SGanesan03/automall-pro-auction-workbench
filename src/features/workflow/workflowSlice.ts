import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  WorkflowCase, WorkflowStepId, WorkflowType, ServiceType, PaymentFlowType,
  Customer, Vehicle, AuctionEvent, Bidder,
} from '../../types/workflow';
import { ActorRole } from '../../types/rbac';
import {
  MOCK_WORKFLOW_CASES, MOCK_CUSTOMERS, MOCK_VEHICLES,
  MOCK_EVENTS, MOCK_BIDDERS,
} from './mockWorkflowData';
import { WORKFLOW_FLOWS, SERVICE_FLOWS, PAYMENT_FLOWS, resolvePaymentStep } from './workflowStepDefs';
import { canWorkflow, canCompleteStep } from '../../auth-rbac/workflowRbac';

interface WorkflowState {
  activeRole: ActorRole;
  cases: WorkflowCase[];
  selectedCaseId: string;
  customers: Customer[];
  vehicles: Vehicle[];
  events: AuctionEvent[];
  bidders: Bidder[];
  activeTab: 'CASES' | 'CUSTOMERS' | 'VEHICLES' | 'EVENTS' | 'BIDDERS' | 'ACCESS_CONTROL';
  bannerMsg: string | null;
  bannerType: 'success' | 'error' | 'info';
}

const initialState: WorkflowState = {
  activeRole: 'BUYER',
  cases: MOCK_WORKFLOW_CASES,
  selectedCaseId: MOCK_WORKFLOW_CASES[0].id,
  customers: MOCK_CUSTOMERS,
  vehicles: MOCK_VEHICLES,
  events: MOCK_EVENTS,
  bidders: MOCK_BIDDERS,
  activeTab: 'CASES',
  bannerMsg: null,
  bannerType: 'info',
};

function buildSteps(stepIds: WorkflowStepId[]): WorkflowCase['steps'] {
  return stepIds.map((sid, i) => ({
    id: sid,
    label: sid.replace(/_/g, ' '),
    status: i === 0 ? ('IN_PROGRESS' as const) : ('PENDING' as const),
  }));
}

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setActiveRole(state, action: PayloadAction<ActorRole>) {
      state.activeRole = action.payload;
      state.activeTab = 'CASES'; // reset to safe tab on role switch
      state.bannerMsg = `Switched to ${action.payload} — workflow access updated`;
      state.bannerType = 'info';
    },
    setActiveTab(state, action: PayloadAction<WorkflowState['activeTab']>) {
      state.activeTab = action.payload;
    },
    selectCase(state, action: PayloadAction<string>) {
      state.selectedCaseId = action.payload;
    },
    createCase(
      state,
      action: PayloadAction<{ workflowType: WorkflowType; serviceType?: ServiceType; paymentFlow?: PaymentFlowType; sellerCategory: WorkflowCase['sellerCategory'] }>
    ) {
      if (!canWorkflow(state.activeRole, 'CREATE_CASE')) {
        state.bannerMsg = `Access Denied: ${state.activeRole} cannot create workflow cases.`;
        state.bannerType = 'error';
        return;
      }
      const { workflowType, serviceType, paymentFlow, sellerCategory } = action.payload;
      const rawStepIds = paymentFlow
        ? PAYMENT_FLOWS[paymentFlow]
        : serviceType
        ? SERVICE_FLOWS[serviceType]
        : WORKFLOW_FLOWS[workflowType];
      const stepIds = rawStepIds.map((sid) => resolvePaymentStep(sid, sellerCategory));
      const id = `WF-${Date.now()}`;
      const newCase: WorkflowCase = {
        id,
        caseNo: `CASE-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        workflowType,
        serviceType,
        paymentFlow,
        sellerCategory,
        currentStepId: stepIds[0],
        status: 'ACTIVE',
        steps: buildSteps(stepIds),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.cases.unshift(newCase);
      state.selectedCaseId = id;
      const label = paymentFlow ? paymentFlow.replace(/_/g, ' ') : workflowType.replace(/_/g, ' ');
      state.bannerMsg = `New case ${newCase.caseNo} created — ${label}`;
      state.bannerType = 'success';
    },
    completeStep(state, action: PayloadAction<{ caseId: string; stepId: WorkflowStepId; notes?: string }>) {
      if (!canCompleteStep(state.activeRole, action.payload.stepId)) {
        state.bannerMsg = `Access Denied: ${state.activeRole} cannot complete step "${action.payload.stepId.replace(/_/g, ' ')}".`;
        state.bannerType = 'error';
        return;
      }
      const wfCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (!wfCase) return;
      const step = wfCase.steps.find((s) => s.id === action.payload.stepId);
      if (!step) return;
      step.status = 'COMPLETED';
      step.completedAt = new Date().toLocaleTimeString('en-IN');
      step.completedBy = state.activeRole;
      step.notes = action.payload.notes;
      // advance to next pending step
      const nextStep = wfCase.steps.find((s) => s.status === 'PENDING');
      if (nextStep) {
        nextStep.status = 'IN_PROGRESS';
        wfCase.currentStepId = nextStep.id;
      } else {
        wfCase.status = 'COMPLETED';
      }
      wfCase.updatedAt = new Date().toISOString();
      state.bannerMsg = `Step "${step.label || step.id}" completed`;
      state.bannerType = 'success';
    },
    skipStep(state, action: PayloadAction<{ caseId: string; stepId: WorkflowStepId }>) {
      if (!canCompleteStep(state.activeRole, action.payload.stepId)) {
        state.bannerMsg = `Access Denied: ${state.activeRole} cannot skip step "${action.payload.stepId.replace(/_/g, ' ')}".`;
        state.bannerType = 'error';
        return;
      }
      const wfCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (!wfCase) return;
      const step = wfCase.steps.find((s) => s.id === action.payload.stepId);
      if (!step) return;
      step.status = 'SKIPPED';
      const nextSkipStep = wfCase.steps.find((s) => s.status === 'PENDING');
      if (nextSkipStep) {
        nextSkipStep.status = 'IN_PROGRESS';
        wfCase.currentStepId = nextSkipStep.id;
      }
      wfCase.updatedAt = new Date().toISOString();
    },
    linkCustomerToCase(state, action: PayloadAction<{ caseId: string; customerId: string }>) {
      const wfCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (wfCase) wfCase.customerId = action.payload.customerId;
    },
    linkVehicleToCase(state, action: PayloadAction<{ caseId: string; vehicleId: string }>) {
      const wfCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (wfCase) wfCase.vehicleId = action.payload.vehicleId;
    },
    linkEventToCase(state, action: PayloadAction<{ caseId: string; eventId: string }>) {
      const wfCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (wfCase) wfCase.eventId = action.payload.eventId;
    },
    addCustomer(state, action: PayloadAction<Omit<Customer, 'id' | 'createdAt'>>) {
      if (!canWorkflow(state.activeRole, 'TAB_CUSTOMERS')) {
        state.bannerMsg = 'Access Denied: Only Seller/Admin can register customers.';
        state.bannerType = 'error';
        return;
      }
      state.customers.push({
        ...action.payload,
        id: `CUST-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      state.bannerMsg = `Customer "${action.payload.name}" registered`;
      state.bannerType = 'success';
    },
    addVehicle(state, action: PayloadAction<Omit<Vehicle, 'id' | 'createdAt'>>) {
      if (!canWorkflow(state.activeRole, 'TAB_VEHICLES')) {
        state.bannerMsg = 'Access Denied: Only Seller/Admin can register vehicles.';
        state.bannerType = 'error';
        return;
      }
      state.vehicles.push({
        ...action.payload,
        id: `VEH-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      state.bannerMsg = `Vehicle ${action.payload.registrationNo} registered`;
      state.bannerType = 'success';
    },
    addEvent(state, action: PayloadAction<Omit<AuctionEvent, 'id' | 'createdAt'>>) {
      if (!canWorkflow(state.activeRole, 'TAB_EVENTS')) {
        state.bannerMsg = 'Access Denied: Only Admin can create events.';
        state.bannerType = 'error';
        return;
      }
      state.events.push({
        ...action.payload,
        id: `EVT-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      state.bannerMsg = `Event "${action.payload.eventName}" created`;
      state.bannerType = 'success';
    },
    addBidder(state, action: PayloadAction<Omit<Bidder, 'id' | 'registeredAt'>>) {
      if (!canWorkflow(state.activeRole, 'TAB_BIDDERS')) {
        state.bannerMsg = 'Access Denied: Only Buyer/Admin can register bidders.';
        state.bannerType = 'error';
        return;
      }
      state.bidders.push({
        ...action.payload,
        id: `BDR-${Date.now()}`,
        registeredAt: new Date().toISOString(),
      });
      state.bannerMsg = `Bidder "${action.payload.name}" registered with EMD ₹${action.payload.emdAmount.toLocaleString('en-IN')}`;
      state.bannerType = 'success';
    },
    clearBanner(state) {
      state.bannerMsg = null;
    },
    setBanner(state, action: PayloadAction<{ msg: string; type: WorkflowState['bannerType'] }>) {
      state.bannerMsg = action.payload.msg;
      state.bannerType = action.payload.type;
    },
  },
});

export const {
  setActiveRole, setActiveTab, selectCase, createCase, completeStep, skipStep,
  linkCustomerToCase, linkVehicleToCase, linkEventToCase,
  addCustomer, addVehicle, addEvent, addBidder, clearBanner, setBanner,
} = workflowSlice.actions;

export default workflowSlice.reducer;
