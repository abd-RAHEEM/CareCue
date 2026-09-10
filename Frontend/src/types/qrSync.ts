export interface PairingPayload {
  kind: 'carecue-pairing';
  version: 1;
  pairingId: string;
  patientId: string;
  expiresAt: string;
}
