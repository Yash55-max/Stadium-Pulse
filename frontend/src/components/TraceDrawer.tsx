import { X } from 'lucide-react'

interface TraceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  traceDetails: any[];
}

export function TraceDrawer({ isOpen, onClose, traceDetails }: TraceDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-stadium-panel border-l border-stadium-muted z-50 flex flex-col shadow-2xl">
      <div className="flex justify-between items-center p-4 border-b border-stadium-muted">
        <h3 className="font-display text-stadium-accent">Agent Trace</h3>
        <button onClick={onClose} className="text-stadium-text hover:text-white" aria-label="Close trace">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-stadium-text space-y-4">
        {traceDetails.length === 0 ? (
          <p className="text-stadium-muted italic">No tool calls for this interaction.</p>
        ) : (
          traceDetails.map((td, i) => (
            <div key={i} className="bg-stadium-base p-2 rounded border border-stadium-muted/50">
              <div className="text-stadium-accent mb-1 font-bold">Tool: {td.name}</div>
              <div className="mb-2">
                <span className="text-stadium-muted">Args:</span>
                <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(td.arguments, null, 2)}</pre>
              </div>
              <div>
                <span className="text-stadium-muted">Result:</span>
                <pre className="mt-1 whitespace-pre-wrap overflow-x-auto max-h-32">{JSON.stringify(td.result, null, 2)}</pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
