import type { ExtractAtomValue } from "jotai";
import type { AtomWithQueryResult } from "jotai-tanstack-query";

export type ExtractQueryDataFromAtom<T> = ExtractAtomValue<T> extends AtomWithQueryResult<infer Data, any> ? Data : never;
