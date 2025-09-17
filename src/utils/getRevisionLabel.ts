import { ModelReturnType } from "@/config/objects/types";
import { formatDate } from "@pzh-ui/components";
import { parseUtc } from "./parseUtc";

type MaybeRevision<T> = T & { isRevision?: boolean };
type STATUS = "Vigerend" | "Vastgesteld" | "Gearchiveerd";
type PREFIX = "Sinds" | "Vanaf";

/**
 * Builds a revision label based on validity dates/status.
 */
const getRevisionLabel = (
  object: MaybeRevision<ModelReturnType>,
  initialObject: MaybeRevision<ModelReturnType>,
  latest?: string
): string => {
  const { Start_Validity, End_Validity, UUID, isRevision } = object;
  if (!Start_Validity) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = parseUtc(Start_Validity);
  const endDate = End_Validity ? parseUtc(End_Validity) : null;
  const formattedDate = formatDate(startDate, "d MMMM yyyy");

  if (isRevision) return "Ontwerpversie";

  // Defaults
  let status: STATUS = "Vigerend";
  let prefix: PREFIX = "Sinds";

  if (startDate > today) {
    status = "Vastgesteld";
    prefix = "Vanaf";
  } else if (
    initialObject.Start_Validity !== Start_Validity ||
    UUID !== latest
  ) {
    status = "Gearchiveerd";
  }

  if (endDate && endDate < today) {
    return `${prefix} ${formattedDate}`;
  }

  return `${prefix} ${formattedDate} (${status})`;
};

export default getRevisionLabel;
