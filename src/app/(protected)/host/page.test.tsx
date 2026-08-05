import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import type { HostDashboardSummary } from "@havyn/shared";
import HostDashboardPage from "./page";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn(() => ({ accessToken: "token-123" })) }));
vi.mock("@/lib/auth/auth-provider", () => ({ useAuth }));

const { getDashboardSummary } = vi.hoisted(() => ({ getDashboardSummary: vi.fn() }));
vi.mock("@/lib/api/host", () => ({ getDashboardSummary }));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <HostDashboardPage />
    </QueryClientProvider>,
  );
}

const populatedSummary: HostDashboardSummary = {
  activeListingsCount: 2,
  totalListingsCount: 3,
  upcomingReservationsCount: 4,
  totalEarnings: [{ currency: "NGN", amount: 150000 }],
  pendingPayoutsCount: 1,
  averageRating: 4.5,
};

describe("HostDashboardPage", () => {
  it("shows an empty state with a create-listing CTA when the host has no listings yet", async () => {
    getDashboardSummary.mockResolvedValue({ ...populatedSummary, totalListingsCount: 0, activeListingsCount: 0 });

    renderPage();

    await screen.findByText("Create your first listing");
    expect(getDashboardSummary).toHaveBeenCalledWith("token-123");
  });

  it("shows real summary figures from the backend, not client-computed ones", async () => {
    getDashboardSummary.mockResolvedValue(populatedSummary);

    renderPage();

    expect(await screen.findByText("2")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("₦150,000")).toBeInTheDocument();
    expect(screen.getByText("4.50")).toBeInTheDocument();
    expect(screen.getByText("3 total")).toBeInTheDocument();
    expect(screen.getByText("1 payout pending")).toBeInTheDocument();
  });

  it("shows an error state with a working retry", async () => {
    getDashboardSummary.mockRejectedValueOnce(new Error("network error")).mockResolvedValueOnce(populatedSummary);

    renderPage();

    await screen.findByText("Couldn't load your dashboard");
    const user = (await import("@testing-library/user-event")).default.setup();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() => expect(screen.getByText("2")).toBeInTheDocument());
  });

  it("has no detectable accessibility violations", async () => {
    getDashboardSummary.mockResolvedValue(populatedSummary);

    const { container } = renderPage();
    await screen.findByText("₦150,000");

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
