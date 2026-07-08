import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { SentSurveysScreen } from "./components/SentSurveysScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { OSDetailsScreen } from "./components/OSDetailsScreen";
import { EnvironmentSelectionScreen } from "./components/EnvironmentSelectionScreen";
import {
  CaptureScreen,
  ServiceData,
} from "./components/CaptureScreen";
import { ServiceCaptureScreen } from "./components/ServiceCaptureScreen";
import { ReviewScreen } from "./components/ReviewScreen";
import { SuccessScreen } from "./components/SuccessScreen";

export type Screen =
  | "login"
  | "home"
  | "dashboard"
  | "sentSurveys"
  | "settings"
  | "osDetails"
  | "environments"
  | "capture"
  | "serviceCapture"
  | "review"
  | "success";

export interface WorkOrder {
  id: string;
  number: string;
  location: string;
  agency: string;
  manager: string;
  status: "Pendente" | "Em Andamento" | "Concluído";
  progress: number;
}

export interface LevantamentoData {
  localName: string;
  agencyCode: string;
  managerName: string;
  technicianId: string;
  selectedEnvironments: string[];
  customEnvironments: string[];
  environmentData: {
    [key: string]: {
      widePhotos: string[];
      services: ServiceData[];
      completed?: boolean;
    };
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("login");
  const [selectedOS, setSelectedOS] =
    useState<WorkOrder | null>(null);
  const [currentEnvironment, setCurrentEnvironment] =
    useState<string>("");
  const [currentService, setCurrentService] =
    useState<string>("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [userPhoto, setUserPhoto] = useState<
    string | undefined
  >(undefined);

  const [levantamentoData, setLevantamentoData] =
    useState<LevantamentoData>({
      localName: "",
      agencyCode: "",
      managerName: "",
      technicianId: "",
      selectedEnvironments: [],
      customEnvironments: [],
      environmentData: {},
    });

  // Apply theme class to HTML element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const selectOS = (os: WorkOrder) => {
    setSelectedOS(os);
    navigateTo("osDetails");
  };

  const updateLevantamento = (
    data: Partial<LevantamentoData>,
  ) => {
    setLevantamentoData((prev) => ({ ...prev, ...data }));
  };

  const startCaptureForEnvironment = (environment: string) => {
    setCurrentEnvironment(environment);
    navigateTo("capture");
  };

  const navigateToService = (serviceName: string) => {
    setCurrentService(serviceName);
    navigateTo("serviceCapture");
  };

  const checkIfAllEnvironmentsCompleted = () => {
    const allEnvironments = [
      ...levantamentoData.selectedEnvironments,
      ...levantamentoData.customEnvironments,
    ];
    if (allEnvironments.length === 0) return false;
    return allEnvironments.every(
      (env) => levantamentoData.environmentData[env]?.completed,
    );
  };

  const getCurrentEnvironmentData = () => {
    return (
      levantamentoData.environmentData[currentEnvironment] || {
        widePhotos: [],
        services: [],
        completed: false,
      }
    );
  };

  const getCurrentService = (): ServiceData | undefined => {
    const envData = getCurrentEnvironmentData();
    return envData.services.find(
      (s) => s.name === currentService,
    );
  };

  const updateCurrentService = (
    photos: Array<{
      photo: string;
      observations: string;
      measurements: string;
    }>,
    detailPhotos: string[],
  ) => {
    const envData = getCurrentEnvironmentData();
    const serviceIndex = envData.services.findIndex(
      (s) => s.name === currentService,
    );

    let updatedServices = [...envData.services];

    if (serviceIndex >= 0) {
      // Atualiza serviço existente
      updatedServices[serviceIndex] = {
        ...updatedServices[serviceIndex],
        photos,
        detailPhotos,
        completed: detailPhotos.length > 0,
      };
    } else {
      // Cria novo serviço
      updatedServices.push({
        name: currentService,
        photos,
        detailPhotos,
        completed: detailPhotos.length > 0,
      });
    }

    const updatedEnvironmentData = {
      ...levantamentoData.environmentData,
      [currentEnvironment]: {
        ...envData,
        services: updatedServices,
      },
    };

    updateLevantamento({
      environmentData: updatedEnvironmentData,
    });
  };

  const handleServiceComplete = () => {
    navigateTo("capture");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--tms-navy-deep)",
      }}
    >
      {currentScreen === "login" && (
        <LoginScreen onLogin={() => navigateTo("home")} />
      )}
      {currentScreen === "home" && (
        <HomeScreen
          onNavigateToSurveys={() => navigateTo("dashboard")}
          onNavigateToSent={() => navigateTo("sentSurveys")}
          onNavigateToSettings={() => navigateTo("settings")}
          userPhoto={userPhoto}
        />
      )}
      {currentScreen === "dashboard" && (
        <DashboardScreen
          onSelectOS={selectOS}
          onBack={() => navigateTo("home")}
        />
      )}
      {currentScreen === "sentSurveys" && (
        <SentSurveysScreen onBack={() => navigateTo("home")} />
      )}
      {currentScreen === "settings" && (
        <SettingsScreen
          onBack={() => navigateTo("home")}
          theme={theme}
          onThemeChange={setTheme}
          userPhoto={userPhoto}
          onPhotoChange={setUserPhoto}
        />
      )}
      {currentScreen === "osDetails" && (
        <OSDetailsScreen
          workOrder={selectedOS}
          onStart={() => navigateTo("environments")}
          onBack={() => navigateTo("dashboard")}
          onDataUpdate={updateLevantamento}
        />
      )}
      {currentScreen === "environments" && (
        <EnvironmentSelectionScreen
          onBack={() => navigateTo("osDetails")}
          selectedEnvironments={
            levantamentoData.selectedEnvironments
          }
          customEnvironments={
            levantamentoData.customEnvironments
          }
          environmentData={levantamentoData.environmentData}
          onUpdateEnvironments={(envs) =>
            updateLevantamento({ selectedEnvironments: envs })
          }
          onUpdateCustomEnvironments={(envs) =>
            updateLevantamento({ customEnvironments: envs })
          }
          onSelectEnvironment={startCaptureForEnvironment}
          onFinish={() => navigateTo("review")}
          allCompleted={checkIfAllEnvironmentsCompleted()}
        />
      )}
      {currentScreen === "capture" && (
        <CaptureScreen
          environment={currentEnvironment}
          environmentData={getCurrentEnvironmentData()}
          onUpdateData={(data) => {
            const updatedEnvironmentData = {
              ...levantamentoData.environmentData,
              [currentEnvironment]: data,
            };
            updateLevantamento({
              environmentData: updatedEnvironmentData,
            });
          }}
          onSave={() => navigateTo("environments")}
          onBack={() => navigateTo("environments")}
          onNavigateToService={navigateToService}
        />
      )}
      {currentScreen === "serviceCapture" && (
        <ServiceCaptureScreen
          serviceName={currentService}
          environment={currentEnvironment}
          servicePhotos={getCurrentService()?.photos || []}
          detailPhotos={getCurrentService()?.detailPhotos || []}
          onUpdatePhotos={(photos) => {
            updateCurrentService(
              photos,
              getCurrentService()?.detailPhotos || [],
            );
          }}
          onUpdateDetailPhotos={(detailPhotos) => {
            updateCurrentService(
              getCurrentService()?.photos || [],
              detailPhotos,
            );
          }}
          onComplete={handleServiceComplete}
          onBack={() => navigateTo("capture")}
        />
      )}
      {currentScreen === "review" && (
        <ReviewScreen
          levantamentoData={levantamentoData}
          workOrder={selectedOS}
          onSubmit={() => navigateTo("success")}
          onBack={() => navigateTo("environments")}
        />
      )}
      {currentScreen === "success" && (
        <SuccessScreen
          workOrder={selectedOS}
          onBackToDashboard={() => navigateTo("home")}
        />
      )}
    </div>
  );
}