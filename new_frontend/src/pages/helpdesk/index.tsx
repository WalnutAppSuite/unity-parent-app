import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpdeskForm() {
  const { t } = useTranslation("helpdesk");

  // Dummy data for categories and subcategories
  const categories = [
    { value: "general", label: "General" },
    { value: "technical", label: "Technical" }
  ];
  const subCategories = [
    { value: "login", label: "Login Issue" },
    { value: "payment", label: "Payment Issue" }
  ];

  return (
    <div className="tw-p-4">
      <Card className="tw-bg-secondary tw-rounded-2xl tw-text-primary">
        <CardHeader>
          <CardTitle className="tw-text-lg tw-leading-6 tw-font-medium">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="tw-space-y-4">
            <div>
              <label className="tw-block tw-mb-1">{t("issue_label")}*</label>
              <Select>
                <SelectTrigger className="tw-bg-white !tw-text-primary data-[placeholder]:tw-text-primary">
                  <SelectValue placeholder={t("issue_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="tw-block tw-mb-1">{t("sub_issue_label")}*</label>
              <Select>
                <SelectTrigger className="tw-bg-white !tw-text-primary data-[placeholder]:tw-text-primary">
                  <SelectValue placeholder={t("sub_issue_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map(sub => (
                    <SelectItem key={sub.value} value={sub.value}>{sub.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="message" className="tw-block tw-mb-1">{t("message_placeholder")}</label>
              <Textarea id="message" />
            </div>
            <div>
              <label className="tw-block tw-mb-1">{t("attachment")}</label>
              <Input type="file" multiple accept="image/*,video/*,application/pdf" />
            </div>
            <div>
              <label className="tw-block tw-mb-1">{t("suggestion")}</label>
              <Card className="tw-mb-2">
                <CardHeader>
                  <CardTitle className="tw-font-semibold">Article Lorem Ipsum is simply dummy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="tw-font-semibold">Article Lorem Ipsum is simply dummy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <label className="tw-block tw-mb-1">{t("did_you_find")}</label>
              <div className="tw-flex tw-gap-2">
                <Button variant="outline">{t("yes")}</Button>
                <Button variant="default">{t("no")}</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}