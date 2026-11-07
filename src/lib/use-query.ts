import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";
import { toast } from "sonner";
import { ApiError, toApiError } from "./api";

interface QueryState<T> {
  data: T | undefined;
  error: ApiError | undefined;
  loading: boolean;
}

/**
 * Loads data when `deps` change, cancelling stale requests. Keeps the previous data while
 * reloading so lists don't flash empty. `setData` allows optimistic local updates.
 */
export function useQuery<T>(load: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<QueryState<T>>({
    data: undefined,
    error: undefined,
    loading: true,
  });
  const [nonce, setNonce] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({ ...current, error: undefined, loading: true }));
    loadRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ data, error: undefined, loading: false });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setState((current) => ({ ...current, error: toApiError(error), loading: false }));
      },
    );
    return () => controller.abort();
    // The caller lists what `load` depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);
  const setData = useCallback(
    (update: (current: T | undefined) => T | undefined) =>
      setState((current) => ({ ...current, data: update(current.data) })),
    [],
  );
  return { ...state, reload, setData };
}

/** Delays a fast-changing value (e.g. a search box) so it doesn't trigger a request per key. */
export function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Shows an API (or network) error as a toast. */
export function reportError(error: unknown) {
  toast.error(toApiError(error).message);
}
