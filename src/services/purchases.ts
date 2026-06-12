import Purchases, {
  PurchasesOffering,
  CustomerInfo,
  PurchasesPackage,
  LOG_LEVEL,
  CustomerInfoUpdateListener,
} from "react-native-purchases";

const API_KEYS = {
  apple: "YOUR_REVENUECAT_APPLE_API_KEY",
  google: "YOUR_REVENUECAT_GOOGLE_API_KEY",
};

const ENTITLEMENT_ID = "premium";
let configured = false;

export function isRevenueCatConfigured(): boolean {
  return configured;
}

export async function configureRevenueCat() {
  if (configured) return;
  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    await Purchases.configure({
      apiKey: API_KEYS.apple,
    });
    configured = true;
  } catch {
    console.warn("RevenueCat not configured — purchases unavailable");
  }
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!configured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<CustomerInfo | null> {
  if (!configured) return null;
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch {
    return null;
  }
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (!configured) return null;
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch {
    return null;
  }
}

export function isPremium(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive === true;
}

export function onCustomerInfoUpdate(
  callback: CustomerInfoUpdateListener,
) {
  if (!configured) return () => {};
  Purchases.addCustomerInfoUpdateListener(callback);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(callback);
  };
}
