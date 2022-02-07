import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";

export function generateAPIKey() {
  return createHash('sha256').update(uuidv4()).digest('hex');
}