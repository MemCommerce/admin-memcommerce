import type { DescriptionReq } from "@/lib/types";
import { DESCRIPTION_URL } from "@/lib/urls";

export const generateAiDescription = async (productDescription: DescriptionReq): Promise<string> => {
  const resp = await fetch(DESCRIPTION_URL, {
    method: "POST",
    body: JSON.stringify(productDescription),
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (!resp.ok) throw Error()
  const data: string = await resp.json()
  return data
}