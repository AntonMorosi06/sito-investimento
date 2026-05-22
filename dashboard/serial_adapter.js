window.MicroBotSerialAdapter = (() => {
  class SerialAdapter {
    constructor(options = {}) {
      this.baudRate = options.baudRate || 115200;
      this.port = null;
      this.reader = null;
      this.writer = null;
      this.keepReading = false;
      this.onLine = options.onLine || (() => {});
      this.onEvent = options.onEvent || (() => {});
      this.onError = options.onError || (() => {});
    }

    isSupported() {
      return "serial" in navigator;
    }

    async connect() {
      if (!this.isSupported()) {
        this.onError({
          code: "WEB_SERIAL_UNAVAILABLE",
          message: "Web Serial is not available in this browser/context. Use Chrome/Edge over localhost or HTTPS."
        });
        return false;
      }

      try {
        this.port = await navigator.serial.requestPort();
        await this.port.open({ baudRate: this.baudRate });

        this.writer = this.port.writable.getWriter();
        this.keepReading = true;

        this.onEvent({
          type: "serial_event",
          message: "Serial port connected.",
          baudRate: this.baudRate
        });

        this.readLoop();
        return true;
      } catch (error) {
        this.onError({
          code: "SERIAL_CONNECT_ERROR",
          message: error.message
        });
        return false;
      }
    }

    async disconnect() {
      this.keepReading = false;

      try {
        if (this.reader) {
          await this.reader.cancel();
          this.reader.releaseLock();
          this.reader = null;
        }

        if (this.writer) {
          this.writer.releaseLock();
          this.writer = null;
        }

        if (this.port) {
          await this.port.close();
          this.port = null;
        }

        this.onEvent({
          type: "serial_event",
          message: "Serial port disconnected."
        });
      } catch (error) {
        this.onError({
          code: "SERIAL_DISCONNECT_ERROR",
          message: error.message
        });
      }
    }

    async sendLine(line) {
      if (!this.writer) {
        this.onError({
          code: "SERIAL_NOT_CONNECTED",
          message: "Cannot send command because serial writer is not available."
        });
        return false;
      }

      try {
        const encoded = new TextEncoder().encode(String(line).trim() + "\n");
        await this.writer.write(encoded);

        this.onEvent({
          type: "serial_tx",
          line: String(line).trim()
        });

        return true;
      } catch (error) {
        this.onError({
          code: "SERIAL_WRITE_ERROR",
          message: error.message
        });
        return false;
      }
    }

    async readLoop() {
      if (!this.port || !this.port.readable) {
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      try {
        this.reader = this.port.readable.getReader();

        while (this.keepReading) {
          const { value, done } = await this.reader.read();

          if (done) {
            break;
          }

          if (value) {
            buffer += decoder.decode(value, { stream: true });

            let newlineIndex = buffer.indexOf("\n");

            while (newlineIndex >= 0) {
              const line = buffer.slice(0, newlineIndex).trim();
              buffer = buffer.slice(newlineIndex + 1);

              if (line) {
                this.onLine(line);
              }

              newlineIndex = buffer.indexOf("\n");
            }
          }
        }
      } catch (error) {
        if (this.keepReading) {
          this.onError({
            code: "SERIAL_READ_ERROR",
            message: error.message
          });
        }
      } finally {
        if (this.reader) {
          try {
            this.reader.releaseLock();
          } catch (_) {}
          this.reader = null;
        }
      }
    }
  }

  return {
    SerialAdapter
  };
})();
