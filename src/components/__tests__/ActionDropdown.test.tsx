import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import ActionDropdown from "../ActionDropdown";

const mockItem = {
  id: 1,
  name: "Test Item",
  email: "test@example.com",
};

const defaultProps = {
  item: mockItem,
  index: 0,
  actionTexts: ["Edit", "Delete", "View"],
  actionFunctions: [jest.fn(), jest.fn(), jest.fn()],
};

describe("ActionDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getBoundingClientRect for positioning
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 50,
      top: 100,
      left: 200,
      bottom: 150,
      right: 300,
      x: 200,
      y: 100,
      toJSON: jest.fn(),
    }));
  });

  describe("Basic Rendering", () => {
    it("renders action button", () => {
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      expect(actionButton).toBeInTheDocument();
    });

    it("shows dropdown when action button is clicked", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
        expect(screen.getByText("View")).toBeInTheDocument();
      });
    });

    it("hides dropdown when clicked outside", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });

      // Click outside
      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      });
    });
  });

  describe("Action Execution", () => {
    it("executes correct action function when action is clicked", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Edit"));

      expect(defaultProps.actionFunctions[0]).toHaveBeenCalledWith(mockItem);
      expect(defaultProps.actionFunctions[1]).not.toHaveBeenCalled();
      expect(defaultProps.actionFunctions[2]).not.toHaveBeenCalled();
    });

    it("executes all action functions correctly", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");

      // Test Edit action
      await user.click(actionButton);
      await waitFor(() => screen.getByText("Edit"));
      await user.click(screen.getByText("Edit"));
      expect(defaultProps.actionFunctions[0]).toHaveBeenCalledWith(mockItem);

      // Test Delete action
      await user.click(actionButton);
      await waitFor(() => screen.getByText("Delete"));
      await user.click(screen.getByText("Delete"));
      expect(defaultProps.actionFunctions[1]).toHaveBeenCalledWith(mockItem);

      // Test View action
      await user.click(actionButton);
      await waitFor(() => screen.getByText("View"));
      await user.click(screen.getByText("View"));
      expect(defaultProps.actionFunctions[2]).toHaveBeenCalledWith(mockItem);
    });

    it("closes dropdown after action is executed", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Edit"));

      await waitFor(() => {
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Interaction", () => {
    it("opens dropdown with Enter key", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      actionButton.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      });
    });
  });

  describe("Custom Styling", () => {
    it("applies custom class names", async () => {
      const user = userEvent.setup();
      const customClassNames = {
        actionButton: "custom-button-class",
        dropdownMenu: "custom-menu-class",
        dropdownItem: "custom-item-class",
      };

      render(
        <ActionDropdown
          {...defaultProps}
          customClassNames={customClassNames}
        />,
      );

      const actionButton = screen.getByLabelText("Actions");
      expect(actionButton).toHaveClass("custom-button-class");

      await user.click(actionButton);

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toHaveClass("custom-menu-class");

        const editButton = screen.getByText("Edit");
        expect(editButton).toHaveClass("custom-item-class");
      });
    });

    it("disables default styles when requested", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} disableDefaultStyles />);

      const actionButton = screen.getByLabelText("Actions");
      expect(actionButton).not.toHaveClass("text-gray-400");

      await user.click(actionButton);

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).not.toHaveClass("bg-white");
      });
    });
  });

  describe("Positioning", () => {
    it("positions dropdown based on button position", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();

        // Check if position style is applied
        const style = window.getComputedStyle(menu);
        expect(menu.style.position).toBe("absolute");
      });
    });

    it("adjusts position when near screen edge", async () => {
      // Mock a button position near screen edge
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 100,
        height: 50,
        top: 100,
        left: window.innerWidth - 50, // Near right edge
        bottom: 150,
        right: window.innerWidth,
        x: window.innerWidth - 50,
        y: 100,
        toJSON: jest.fn(),
      }));

      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();
        // Position should be adjusted to stay on screen
        expect(Number.parseInt(menu.style.left)).toBeLessThan(
          window.innerWidth - 240,
        );
      });
    });
  });

  describe("Error Handling", () => {
    it("handles missing action functions gracefully", async () => {
      const user = userEvent.setup();
      const propsWithMissingFunction = {
        ...defaultProps,
        actionFunctions: [jest.fn(), undefined, jest.fn()] as any,
      };

      render(<ActionDropdown {...propsWithMissingFunction} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        expect(screen.getByText("Delete")).toBeInTheDocument();
      });

      // Should not throw error when clicking on action with missing function
      expect(() => user.click(screen.getByText("Delete"))).not.toThrow();
    });

    it("handles empty action arrays", () => {
      const emptyProps = {
        ...defaultProps,
        actionTexts: [],
        actionFunctions: [],
      };

      render(<ActionDropdown {...emptyProps} />);

      const actionButton = screen.getByLabelText("Actions");
      expect(actionButton).toBeInTheDocument();
    });
  });

  describe("Portal Rendering", () => {
    it("renders dropdown in portal", async () => {
      const user = userEvent.setup();
      render(<ActionDropdown {...defaultProps} />);

      const actionButton = screen.getByLabelText("Actions");
      await user.click(actionButton);

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();

        // Menu should be rendered in document.body via portal
        expect(document.body.contains(menu)).toBe(true);
      });
    });
  });
});
