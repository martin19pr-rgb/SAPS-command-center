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
  { id: "TL-01", lat: -29.3167, lng: 27.4833, name: "Kingsway & Pioneer Rd", district: "Maseru CBD", state: "normal" },
  { id: "TL-02", lat: -29.2950, lng: 27.4750, name: "A1 North — Maseru Exit", district: "A1 Corridor", state: "normal" },
  { id: "TL-03", lat: -29.3200, lng: 27.4870, name: "Moshoeshoe Rd & Lerotholi Ave", district: "Maseru CBD", state: "normal" },
  { id: "TL-04", lat: -29.3100, lng: 27.5000, name: "A2 & Constitution Rd", district: "Maseru East", state: "normal" },
  { id: "TL-05", lat: -29.3350, lng: 27.5100, name: "Airport Rd & Thamae", district: "Thamae", state: "normal" },
  { id: "TL-06", lat: -29.3145, lng: 27.4800, name: "Civic Centre Intersection", district: "Civic Quarter", state: "normal" },
  { id: "TL-07", lat: -29.3230, lng: 27.4960, name: "United Nations Rd & Orpen Rd", district: "Maseru CBD", state: "normal" },
];

export const defaultCameras: CctvCamera[] = [
  { id: "CAM-101", lat: -29.3167, lng: 27.4833, name: "Maseru CBD Square", type: "CCTV", tracking: false, imgSeed: "mseruCBD" },
  { id: "CAM-102", lat: -29.2800, lng: 27.4750, name: "A1 Northbound Checkpoint", type: "Traffic", tracking: false, imgSeed: "a1north" },
  { id: "CAM-103", lat: -29.3230, lng: 27.4960, name: "Queen Elizabeth Rd Intersection", type: "CCTV", tracking: false, imgSeed: "qeroad" },
  { id: "CAM-104", lat: -29.3350, lng: 27.5100, name: "Maseru Mall Entrance", type: "CCTV", tracking: false, imgSeed: "mall" },
  { id: "CAM-105", lat: -29.2950, lng: 27.4850, name: "Leabua Jonathan Bridge", type: "Traffic", tracking: false, imgSeed: "bridge" },
  { id: "CAM-106", lat: -29.3145, lng: 27.4800, name: "Parliament Complex Front", type: "CCTV", tracking: false, imgSeed: "parliament" },
];
