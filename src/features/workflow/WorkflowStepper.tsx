import React from 'react';
import { CheckCircle2, Circle, SkipForward, Loader2, Lock } from 'lucide-react';
import { WorkflowCase } from '../../types/workflow';
import { ALL_STEP_DEFS } from './workflowStepDefs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { completeStep, skipStep } from './workflowSlice';
import { canCompleteStep, STEP_OWNER_LABEL } from '../../auth-rbac/workflowRbac';

interface Props { wfCase: WorkflowCase; }

const STATUS_ICON = {
  COMPLETED:   <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
  IN_PROGRESS: <Loader2 className="h-4 w-4 text-[#ED264F] shrink-0 animate-spin" />,
  PENDING:     <Circle className="h-4 w-4 text-slate-300 shrink-0" />,
  SKIPPED:     <SkipForward className="h-4 w-4 text-slate-400 shrink-0" />,
};

const STATUS_ROW: Record<string, string> = {
  COMPLETED:   'bg-emerald-50 border-emerald-200',
  IN_PROGRESS: 'bg-[#FFF1F4] border-[#ED264F]/30 ring-1 ring-[#ED264F]/20',
  PENDING:     'bg-white border-slate-200',
  SKIPPED:     'bg-slate-50 border-slate-200 opacity-60',
};

export const WorkflowStepper: React.FC<Props> = ({ wfCase }) => {
  const dispatch = useAppDispatch();
  const activeRole = useAppSelector((s) => s.workflow.activeRole);
  const completedCount = wfCase.steps.filter((s) => s.status === 'COMPLETED').length;
  const pct = Math.round((completedCount / wfCase.steps.length) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span>{completedCount} of {wfCase.steps.length} steps completed</span>
        <span className="font-bold text-[#2E054E]">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-[#2E054E] to-[#ED264F] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
        {wfCase.steps.map((step, idx) => {
          const def = ALL_STEP_DEFS[step.id];
          const isActive = step.status === 'IN_PROGRESS';
          const ownerInfo = STEP_OWNER_LABEL[step.id];
          const allowed = canCompleteStep(activeRole, step.id);

          return (
            <div
              key={step.id}
              className={`rounded-xl border px-3 py-2.5 transition-all ${STATUS_ROW[step.status]}`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{STATUS_ICON[step.status]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-semibold ${isActive ? 'text-[#ED264F]' : step.status === 'COMPLETED' ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {idx + 1}. {def?.label ?? step.id.replace(/_/g, ' ')}
                      </span>
                      {ownerInfo && (
                        <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${ownerInfo.style}`}>
                          {ownerInfo.owner}
                        </span>
                      )}
                    </div>
                    {step.status === 'COMPLETED' && step.completedAt && (
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{step.completedAt}</span>
                    )}
                  </div>
                  {def?.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{def.description}</p>
                  )}
                  {def?.conditional && (
                    <span className="inline-block mt-1 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] text-amber-700">
                      ⚡ {def.conditional}
                    </span>
                  )}
                  {step.notes && (
                    <p className="text-[11px] text-slate-400 mt-0.5 italic">{step.notes}</p>
                  )}
                </div>

                {isActive && wfCase.status === 'ACTIVE' && (
                  allowed ? (
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => dispatch(completeStep({ caseId: wfCase.id, stepId: step.id }))}
                        className="rounded-lg bg-[#2E054E] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#45126E]"
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(skipStep({ caseId: wfCase.id, stepId: step.id }))}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Skip
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                      <Lock className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] text-slate-400">
                        {ownerInfo?.owner ?? 'Other'} only
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
