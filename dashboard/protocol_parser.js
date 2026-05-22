window.MicroBotProtocolParser = (() => {
  const REQUIRED_BASE_FIELDS = ["type", "source"];

  function safeParseLine(line) {
    const trimmed = String(line || "").trim();

    if (!trimmed) {
      return {
        ok: false,
        error: "EMPTY_LINE",
        message: "No protocol line to parse.",
        raw: line
      };
    }

    try {
      const packet = JSON.parse(trimmed);
      const validation = validatePacket(packet);

      if (!validation.ok) {
        return {
          ok: false,
          error: validation.error,
          message: validation.message,
          raw: line,
          packet
        };
      }

      return {
        ok: true,
        packet
      };
    } catch (error) {
      return {
        ok: false,
        error: "JSON_PARSE_ERROR",
        message: error.message,
        raw: line
      };
    }
  }

  function validatePacket(packet) {
    if (!packet || typeof packet !== "object" || Array.isArray(packet)) {
      return {
        ok: false,
        error: "INVALID_PACKET_OBJECT",
        message: "Packet must be a JSON object."
      };
    }

    for (const field of REQUIRED_BASE_FIELDS) {
      if (!(field in packet)) {
        return {
          ok: false,
          error: "MISSING_FIELD",
          message: "Missing required field: " + field
        };
      }
    }

    if (!["event", "command", "response", "telemetry", "heartbeat", "error"].includes(packet.type)) {
      return {
        ok: false,
        error: "UNKNOWN_PACKET_TYPE",
        message: "Unknown packet type: " + packet.type
      };
    }

    return {
      ok: true
    };
  }

  function normalizePacket(packet) {
    return {
      version: packet.version || "unknown",
      type: packet.type || "unknown",
      source: packet.source || "unknown",
      target: packet.target || "PC_CONTROLLER",
      seq: packet.seq || null,
      timestamp_ms: packet.timestamp_ms || Date.now(),
      command: packet.command || null,
      status: packet.status || null,
      state: packet.state || null,
      payload: packet.payload || {}
    };
  }

  function packetToEvent(packet) {
    const normalized = normalizePacket(packet);

    return {
      id: normalized.seq || Date.now(),
      type: normalized.type,
      source: normalized.source,
      target: normalized.target,
      command: normalized.command,
      status: normalized.status,
      state: normalized.state,
      payload: normalized.payload,
      timestamp_ms: normalized.timestamp_ms
    };
  }

  return {
    safeParseLine,
    validatePacket,
    normalizePacket,
    packetToEvent
  };
})();
