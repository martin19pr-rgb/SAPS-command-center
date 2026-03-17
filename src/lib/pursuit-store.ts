"use client";

import { createContext, useContext, useState, ReactNode, createElement } from "react";

export type TrafficState = "normal" | "green_corridor" | "held_red" | "blocked";

export interface TrafficNode {
  id: string;
  lat: number;
  lng: number;
  name: string;
  district: string;
  state: TrafficState;
}

export interface CctvCamera {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: "CCTV" | "Traffic" | "Bodycam";
  tracking: boolean;
  imgSeed: string;
}

export interface PursuitData {
  active: boolean;
  incidentId: string;
  suspectId: string;
  suspectVehicle: string;
  suspectDirection: string;
  suspectSpeed: string;
  nextCamera: string;
  currentCamera: string;
  recommendedUnits: string[];
  interceptionPoint: string;
  interceptionLat: number;
  interceptionLng: number;
  trafficAction: string;
  elapsedSeconds: number;
}

export interface CommandStore {
  pursuit: PursuitData | null;
  trafficNodes: TrafficNode[];
  cameras: CctvCamera[];
  activeMapTab: MapTab;
  lastCommand: { text: string; response: string; type: CommandType } | null;
  setPursuit: (p: PursuitData | null) => void;
  setTrafficState: (id: string, state: TrafficState) => void;
  setActiveMapTab: (tab: MapTab) => void;
  setLastCommand: (c: CommandStore["lastCommand"]) => void;
  activateGreenCorridor: () => void;
  activatePursuitMode: () => void;
  resetTraffic: () => void;
}

export type MapTab = "standard" | "risk" | "patrol" | "traffic" | "cameras" | "pursuit";
export type CommandType = "TRAFFIC" | "CAMERA" | "PURSUIT" | "DISPATCH" | "INFO" | "GENERAL";

export const defaultTrafficNodes: TrafficNode[] = [
  { id: "TL-01", lat: -23.9045, lng: 29.4519, name: "Church St & Nelson Mandela Dr", district: "Polokwane CBD", state: "normal" },
  { id: "TL-02", lat: -23.8830, lng: 29.4490, name: "N1 North — Police Exit", district: "N1 Corridor", state: "normal" },
  { id: "TL-03", lat: -23.9060, lng: 29.4560, name: "Schoeman St & Rabe St", district: "Polokwane CBD", state: "normal" },
  { id: "TL-04", lat: -23.9010, lng: 29.4700, name: "R71 & Hans van Rensburg St", district: "Polokwane East", state: "normal" },
  { id: "TL-05", lat: -23.9200, lng: 29.4900, name: "Thornhill Rd & Molemole St", district: "Thornhill", state: "normal" },
  { id: "TL-06", lat: -23.8965, lng: 29.4485, name: "Civic Centre Intersection", district: "Civic Quarter", state: "normal" },
  { id: "TL-07", lat: -23.9108, lng: 29.4650, name: "Biccard St & Devenish St", district: "Polokwane CBD", state: "normal" },
];

export const defaultCameras: CctvCamera[] = [
  { id: "CAM-101", lat: -23.9045, lng: 29.4679, name: "Polokwane CBD Square", type: "CCTV", tracking: false, imgSeed: "plkcbd" },
  { id: "CAM-102", lat: -23.8700, lng: 29.4550, name: "N1 Northbound Overpass", type: "Traffic", tracking: false, imgSeed: "n1north" },
  { id: "CAM-103", lat: -23.9108, lng: 29.4750, name: "Hospital Rd Intersection", type: "CCTV", tracking: false, imgSeed: "hospital" },
  { id: "CAM-104", lat: -23.9200, lng: 29.4900, name: "Thornhill Shopping Centre", type: "CCTV", tracking: false, imgSeed: "thornhill" },
  { id: "CAM-105", lat: -23.8600, lng: 29.4700, name: "Mankweng R71 Junction", type: "Traffic", tracking: false, imgSeed: "r71jct" },
  { id: "CAM-106", lat: -23.8965, lng: 29.4485, name: "Civic Centre Front", type: "CCTV", tracking: false, imgSeed: "civic" },
];
