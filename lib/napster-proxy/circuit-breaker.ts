type CircuitState = 'closed' | 'open' | 'half-open'

export class CircuitBreaker {
  private state: CircuitState = 'closed'
  private failures = 0
  private openedAtMs = 0

  constructor(
    private readonly failureThreshold: number,
    private readonly openDurationMs: number
  ) {}

  public canRequest(nowMs = Date.now()) {
    if (this.state !== 'open') {
      return true
    }

    const isCooldownFinished = nowMs - this.openedAtMs >= this.openDurationMs
    if (!isCooldownFinished) {
      return false
    }

    this.state = 'half-open'
    return true
  }

  public onSuccess() {
    this.state = 'closed'
    this.failures = 0
    this.openedAtMs = 0
  }

  public onFailure(nowMs = Date.now()) {
    this.failures += 1
    if (this.failures >= this.failureThreshold) {
      this.state = 'open'
      this.openedAtMs = nowMs
    }
  }

  public getState() {
    return this.state
  }
}
