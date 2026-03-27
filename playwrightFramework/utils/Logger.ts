/**
 * Logger — Simple console logger for test steps.
 * Adds timestamps and emoji icons for readability.
 */
export class Logger {

  static info(message: string): void {
    console.log(`ℹ️  [${this.timestamp()}] INFO  — ${message}`);
  }

  static step(message: string): void {
    console.log(`▶  [${this.timestamp()}] STEP  — ${message}`);
  }

  static pass(message: string): void {
    console.log(`✅ [${this.timestamp()}] PASS  — ${message}`);
  }

  static fail(message: string): void {
    console.error(`❌ [${this.timestamp()}] FAIL  — ${message}`);
  }

  static warn(message: string): void {
    console.warn(`⚠️  [${this.timestamp()}] WARN  — ${message}`);
  }

  static api(method: string, endpoint: string, status: number): void {
    const icon = status < 400 ? '✅' : '❌';
    console.log(`${icon} [${this.timestamp()}] API   — ${method} ${endpoint} → ${status}`);
  }

  private static timestamp(): string {
    return new Date().toISOString().slice(11, 23);
  }
}
