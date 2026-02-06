import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { Radius, Spacing } from "./Spacing";
import { FontFamily, FontSize } from "./Typography";

export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },

  text: {
    fontSize: FontSize.md,
    color: Colors.black,
    fontFamily: FontFamily.regular,
  },

  heading: {
    fontSize: FontSize.xl,
    color: Colors.black,
    fontFamily: FontFamily.bold,
    marginBottom: Spacing.lg,
  },

  subheading: {
    fontSize: FontSize.lg,
    color: Colors.black,
    fontFamily: FontFamily.bold,
    marginBottom: Spacing.md,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: "center",
  },

  buttonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: Spacing.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Form styles
  fieldSection: {
    gap: Spacing.sm,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
  },
  pickerInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.white,
  },
  pickerInputError: {
    borderColor: Colors.error,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  buttonFlex: {
    flex: 1,
  },
});
