export type ModelMap = Record<string, string>

export const DEFAULT_MODEL_MAP: ModelMap = {
  'grok-code-fast-1': 'grok-code-fast-1',
  'grok-4-1-fast-reasoning': 'grok-4-1-fast-reasoning',
  'grok-4-1-fast-non-reasoning': 'grok-4-1-fast-non-reasoning',
  'grok-4-1-fast': 'grok-4-1-fast',
}

const MODEL_ALIASES: Record<string, string> = {
  'grok-code-fast-1': 'grok-code-fast-1',
  'grok  code fast 1': 'grok-code-fast-1',
  'grok code fast 1': 'grok-code-fast-1',
  'grok-4-1-fast-reasoning': 'grok-4-1-fast-reasoning',
  'grok-4-fast-reasoning': 'grok-4-1-fast-reasoning',
  'grok 4.1 fast reasoning': 'grok-4-1-fast-reasoning',
  'grok 4 fast reasoning': 'grok-4-1-fast-reasoning',
  'grok-4-1-fast-non-reasoning': 'grok-4-1-fast-non-reasoning',
  'grok-4-fast-non-reasoning': 'grok-4-1-fast-non-reasoning',
  'grok 4.1 fast non reasoning': 'grok-4-1-fast-non-reasoning',
  'grok 4 fast non reasoning': 'grok-4-1-fast-non-reasoning',
  'grok-4-1-fast': 'grok-4-1-fast',
  'grok-4-fast': 'grok-4-1-fast',
  'grok 4.1 fast': 'grok-4-1-fast',
  'grok 4 fast': 'grok-4-1-fast',
}

export function normalizeModelId(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return null
  }

  return MODEL_ALIASES[normalized] || null
}

export function resolveUpstreamModel(
  selectedModel: unknown,
  modelMap: ModelMap
): { selectedModel: string; upstreamModel: string } | null {
  const normalizedModel = normalizeModelId(selectedModel)
  if (!normalizedModel) {
    return null
  }

  const upstreamModel = modelMap[normalizedModel]
  if (!upstreamModel) {
    return null
  }

  return {
    selectedModel: normalizedModel,
    upstreamModel,
  }
}

export function listAllowedModels(modelMap: ModelMap): string[] {
  return Object.keys(modelMap).sort((a, b) => a.localeCompare(b))
}
