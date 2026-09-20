import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/routing";

const RootPage = () => redirect(`/${defaultLocale}`);

export default RootPage;
