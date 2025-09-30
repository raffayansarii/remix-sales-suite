import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CreateOpportunityModalProps,
  OpportunityFormData,
  opportunitySchema,
} from "./types-and-schemas";
import {
  useGetTenantsQuery,
  useLazyGetTenantsQuery,
} from "@/api/tenants/tenantsApi";
import { AsyncSelect } from "../ui/AsyncSearchDropdown";
import { ITenant } from "@/api/tenants/tenantsTypes";
import { Edit3, Check } from "lucide-react";

export function EditOpportunityModal({
  isOpen,
  onClose,
  onSubmit,
  status,
  initialData,
  viewOnly = false,
}: CreateOpportunityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenant, setTenant] = useState<string | number>("");
  const [isTenantEditable, setIsTenantEditable] = useState(false);

  const [trigger, result] = useLazyGetTenantsQuery();
  const { data } = useGetTenantsQuery(`id=eq.${initialData?.tenant_id}`);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: "",
      company: "",
      contact: "",
      value: "",
      stage: "Lead",
      award_type: "Contract",
      agency: "",
      solicitation: "",
      probability: 30,
      close_date: "",
      description: "",
      pinned: false,
      tenant_id: "", // Default value
      ...initialData,
      created_by: userData.id, // Default value
    },
  });

  const onSubmitHandler = async (data: OpportunityFormData) => {
    setIsSubmitting(true);

    console.log("🚀 [CREATE OPPORTUNITY] Form submitted with data:", data);

    onSubmit(data);

    console.log("✅ [CREATE OPPORTUNITY] Opportunity edited successfully");

    setIsSubmitting(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{viewOnly ? "View" : "Edit"} Opportunity</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler, (errrors) =>
              console.log(
                "❌ [CREATE OPPORTUNITY] Form submission errors:",
                errrors
              )
            )}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter opportunity title"
                        {...field}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company name"
                        {...field}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact */}
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter contact name"
                        {...field}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="75000.00"
                        {...field}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Probability */}
              <FormField
                control={form.control}
                name="probability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probability (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="30"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stage */}
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={viewOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Closed Won">Closed Won</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Award Type */}
              <FormField
                control={form.control}
                name="award_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={viewOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select award type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Grant">Grant</SelectItem>
                        <SelectItem value="Cooperative Agreement">
                          Cooperative Agreement
                        </SelectItem>
                        <SelectItem value="Purchase Order">
                          Purchase Order
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agency */}
              <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter agency name"
                        {...field}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Solicitation */}
              <FormField
                control={form.control}
                name="solicitation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solicitation *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="TEST-2024-001"
                        {...field}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Close Date */}
              <FormField
                control={form.control}
                name="close_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Close Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={viewOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pinned */}
              <FormField
                control={form.control}
                name="pinned"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 mt-6">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormLabel>Pinned</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter opportunity description"
                      className="min-h-[100px]"
                      {...field}
                      disabled={viewOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden fields for tenant_id and created_by */}
            {viewOnly ? (
              <>
                <div>
                  <FormLabel>Tenant</FormLabel>
                  <FormControl>
                    <Input
                      value={data?.data?.[0]?.name || ""}
                      disabled
                      className="bg-muted"
                    />
                  </FormControl>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {!isTenantEditable ? (
                  <div>
                    <FormLabel>Tenant</FormLabel>
                    <div className="flex w-full items-end gap-2 mt-2">
                      <FormControl>
                        <Input
                          value={data?.data?.[0]?.name || ""}
                          disabled
                          className="bg-muted"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsTenantEditable(true)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full items-end gap-2">
                    <AsyncSelect
                      getOptionLabel={(tenant: ITenant) => tenant.name}
                      fetchOptions={async (params) => {
                        console.log("Fetching tenants with params:", params);
                        const res = await trigger(params).unwrap();
                        return res.data; // { data, pagination }
                      }}
                      renderOption={(tenant) => (
                        <span>{tenant.name || data.data?.[0]?.name}</span>
                      )}
                      onSelect={(tenant) => {
                        setTenant(tenant.id);
                        form.setValue("tenant_id", tenant.id);
                      }}
                      placeholder="Search tenants..."
                      label="Tenant"
                      searchKey="name"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsTenantEditable(false)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {!viewOnly && (
                <Button
                  type="submit"
                  disabled={status.isLoading || isSubmitting}
                >
                  {status.isLoading || isSubmitting
                    ? "Editing..."
                    : "Edit Opportunity"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
