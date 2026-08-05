import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import type { PropertySummary } from "@havyn/shared";
import HostListingsPage from "./page";

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn(() => ({ accessToken: "token-123" })) }));
vi.mock("@/lib/auth/auth-provider", () => ({ useAuth }));

const { listHostListings, submitListing, publishListing, suspendListing, reactivateListing } = vi.hoisted(() => ({
  listHostListings: vi.fn(),
  submitListing: vi.fn(),
  publishListing: vi.fn(),
  suspendListing: vi.fn(),
  reactivateListing: vi.fn(),
}));
vi.mock("@/lib/api/host", () => ({ listHostListings, submitListing, publishListing, suspendListing, reactivateListing }));

const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: toastSuccess, error: vi.fn() } }));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <HostListingsPage />
    </QueryClientProvider>,
  );
}

const draftListing: PropertySummary = {
  id: "p1",
  title: "Sunset Villa",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
  lat: null,
  lng: null,
  propertyType: "VILLA",
  currency: "NGN",
  basePrice: 20000,
  capacity: 4,
  bedrooms: 2,
  ratingAvg: 0,
  ratingCount: 0,
  status: "DRAFT",
};

describe("HostListingsPage", () => {
  it("shows an empty state with no listings", async () => {
    listHostListings.mockResolvedValue({ data: [], page: 0, size: 20, total: 0, nextCursor: null });

    renderPage();

    await screen.findByText("No listings yet");
  });

  it("shows each listing with its status and lets a draft be submitted for review", async () => {
    listHostListings.mockResolvedValue({ data: [draftListing], page: 0, size: 20, total: 1, nextCursor: null });
    submitListing.mockResolvedValue({ ...draftListing, status: "PENDING" });

    const user = userEvent.setup();
    renderPage();

    await screen.findByText("Sunset Villa");
    expect(screen.getByText("Draft")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit for review" }));

    await waitFor(() => expect(submitListing).toHaveBeenCalledWith("token-123", "p1"));
    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith("Submitted for review"));
  });

  it("has no detectable accessibility violations", async () => {
    listHostListings.mockResolvedValue({ data: [draftListing], page: 0, size: 20, total: 1, nextCursor: null });

    const { container } = renderPage();
    await screen.findByText("Sunset Villa");

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
