import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import TripsPage from "./page";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn(() => ({ accessToken: "token-123" })) }));
vi.mock("@/lib/auth/auth-provider", () => ({ useAuth }));

const { listBookings, cancelBooking } = vi.hoisted(() => ({
  listBookings: vi.fn(),
  cancelBooking: vi.fn(),
}));
vi.mock("@/lib/api/bookings", () => ({ listBookings, cancelBooking }));

const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: toastSuccess, error: vi.fn() } }));

const PENDING_BOOKING = {
  id: "booking-1",
  property: { id: "prop-1", title: "Sunset Villa", city: "Lagos", state: "Lagos", country: "Nigeria" },
  checkIn: "2026-09-01",
  checkOut: "2026-09-04",
  nights: 3,
  guests: 2,
  grandTotal: 35000,
  currency: "NGN",
  status: "PENDING",
  holdExpiresAt: "2026-08-01T12:30:00Z",
  createdAt: "2026-08-01T12:15:00Z",
};

const CANCELLED_BOOKING = { ...PENDING_BOOKING, id: "booking-2", status: "CANCELLED", holdExpiresAt: null };

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TripsPage />
    </QueryClientProvider>,
  );
}

describe("TripsPage", () => {
  it("shows an empty state (not bare gray text) when there are no bookings", async () => {
    listBookings.mockResolvedValue({ data: [], page: 0, size: 20, total: 0, nextCursor: null });
    renderPage();

    expect(await screen.findByText("No trips booked yet")).toBeInTheDocument();
  });

  it("shows real bookings with honest status labels and dates", async () => {
    listBookings.mockResolvedValue({ data: [PENDING_BOOKING], page: 0, size: 20, total: 1, nextCursor: null });
    renderPage();

    expect(await screen.findByText("Sunset Villa")).toBeInTheDocument();
    expect(screen.getByText("Awaiting payment")).toBeInTheDocument();
    expect(screen.getByText("₦35,000")).toBeInTheDocument();
  });

  it("only offers Cancel for a cancellable booking, not an already-cancelled one", async () => {
    listBookings.mockResolvedValue({
      data: [PENDING_BOOKING, CANCELLED_BOOKING],
      page: 0,
      size: 20,
      total: 2,
      nextCursor: null,
    });
    renderPage();

    await screen.findAllByText("Sunset Villa"); // both bookings share the same test fixture property
    expect(screen.getAllByRole("button", { name: "Cancel" })).toHaveLength(1);
  });

  it("cancelling a booking calls the real API and confirms via toast", async () => {
    listBookings.mockResolvedValue({ data: [PENDING_BOOKING], page: 0, size: 20, total: 1, nextCursor: null });
    cancelBooking.mockResolvedValue({ booking: { ...PENDING_BOOKING, status: "CANCELLED" }, refundPercentage: 0, refundAmount: 0 });
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Cancel" }));

    expect(cancelBooking).toHaveBeenCalledWith("token-123", "booking-1");
    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith(expect.stringContaining("cancelled")));
  });

  it("has no detectable accessibility violations", async () => {
    listBookings.mockResolvedValue({ data: [PENDING_BOOKING], page: 0, size: 20, total: 1, nextCursor: null });
    const { container } = renderPage();
    await screen.findByText("Sunset Villa");

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
