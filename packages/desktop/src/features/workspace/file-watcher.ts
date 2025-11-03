// Electron API types - defined in src/types/electron.d.ts

export interface WatcherEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
  path: string;
  timestamp: Date;
}

export class FileWatcher {
  private watcherId: string | null = null;
  private watchPath: string | null = null;
  private eventHandlers: Map<string, (event: WatcherEvent) => void> = new Map();
  private eventQueue: WatcherEvent[] = [];
  private processingQueue: boolean = false;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  async watch(path: string): Promise<void> {
    if (this.watcherId) {
      await this.unwatch();
    }

    this.watchPath = path;
    this.watcherId = `watcher-${Date.now()}`;

    try {
      const result = await window.electron.ipcRenderer.invoke('fs:watch', path, this.watcherId);

      if (result.success) {
        this.setupEventListener();
        console.log(`Watching: ${path}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to setup watcher:', error);
      throw error;
    }
  }

  async unwatch(): Promise<void> {
    if (!this.watcherId) {return;}

    try {
      const result = await window.electron.ipcRenderer.invoke('fs:unwatch', this.watcherId);

      if (result.success) {
        this.watcherId = null;
        this.watchPath = null;
        this.eventHandlers.clear();
        this.eventQueue = [];
        console.log('Watcher stopped');
      }
    } catch (error) {
      console.error('Failed to stop watcher:', error);
    }
  }

  on(eventType: WatcherEvent['type'], handler: (event: WatcherEvent) => void): () => void {
    const handlerId = `${eventType}-${Date.now()}-${Math.random()}`;
    this.eventHandlers.set(handlerId, handler);

    return () => {
      this.eventHandlers.delete(handlerId);
    };
  }

  private setupEventListener(): void {
    window.electron.ipcRenderer.on('fs:watcher-event', (rawEvent: any) => {
      if (rawEvent.watcherId !== this.watcherId) {return;}

      const event: WatcherEvent = {
        type: rawEvent.type,
        path: rawEvent.path,
        timestamp: new Date(),
      };

      this.queueEvent(event);
    });
  }

  private queueEvent(event: WatcherEvent): void {
    this.eventQueue.push(event);

    if (!this.processingQueue) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.eventQueue.length === 0) {
      return;
    }

    this.processingQueue = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();

      if (event) {
        this.debouncedEmit(event);
      }

      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    this.processingQueue = false;
  }

  private debouncedEmit(event: WatcherEvent): void {
    const key = `${event.type}-${event.path}`;
    const existingTimer = this.debounceTimers.get(key);

    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.emit(event);
      this.debounceTimers.delete(key);
    }, 100);

    this.debounceTimers.set(key, timer);
  }

  private emit(event: WatcherEvent): void {
    const handlersArray = Array.from(this.eventHandlers.values());
    for (const handler of handlersArray) {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in watcher event handler:', error);
      }
    }
  }

  getWatchPath(): string | null {
    return this.watchPath;
  }

  isWatching(): boolean {
    return this.watcherId !== null;
  }

  getEventQueueSize(): number {
    return this.eventQueue.length;
  }
}
