import { CheatDetection } from '../types';

// Constants for cheat detection
const SUSPICIOUS_TAB_SWITCHES = 2;
const MIN_RESPONSE_TIME = 5000; // 5 seconds
const MAX_RESPONSE_TIME = 300000; // 5 minutes

export class CheatDetectionManager {
  private static instance: CheatDetectionManager;
  private tabSwitches: number = 0;
  private startTime: number = Date.now();
  private hidden: string | undefined;
  private visibilityChange!: string;
  private onTabSwitchCallback: (() => void) | null = null; // New callback

  private constructor() {
    if (typeof document.hidden !== "undefined") {
      this.hidden = "hidden";
      this.visibilityChange = "visibilitychange";
    } else if (typeof (document as any).msHidden !== "undefined") {
      this.hidden = "msHidden";
      this.visibilityChange = "msvisibilitychange";
    } else if (typeof (document as any).webkitHidden !== "undefined") {
      this.hidden = "webkitHidden";
      this.visibilityChange = "webkitvisibilitychange";
    }
    document.addEventListener(this.visibilityChange, this.handleVisibilityChange.bind(this));
  }

  public static getInstance(): CheatDetectionManager {
    if (!CheatDetectionManager.instance) {
      CheatDetectionManager.instance = new CheatDetectionManager();
    }
    return CheatDetectionManager.instance;
  }

  // Register a callback for tab switches
  public setOnTabSwitchCallback(callback: () => void): void {
    this.onTabSwitchCallback = callback;
  }

  private handleVisibilityChange(): void {
    if (document[this.hidden as keyof Document]) {
      this.tabSwitches++;
      if (this.onTabSwitchCallback) {
        this.onTabSwitchCallback(); // Trigger callback immediately
      }
    }
  }

  public startExercise(): void {
    this.tabSwitches = 0;
    this.startTime = Date.now();
  }

  public getDetectionData(): CheatDetection {
    const responseTime = Date.now() - this.startTime;
    const suspicious = this.isResponseSuspicious(responseTime);
    return {
      tabSwitches: this.tabSwitches,
      startTime: this.startTime,
      responseTime,
      suspicious
    };
  }

  private isResponseSuspicious(responseTime: number): boolean {
    return (
      this.tabSwitches >= SUSPICIOUS_TAB_SWITCHES ||
      responseTime < MIN_RESPONSE_TIME ||
      responseTime > MAX_RESPONSE_TIME
    );
  }
}