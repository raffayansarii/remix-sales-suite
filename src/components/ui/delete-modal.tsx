import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Info } from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  itemName?: string;
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconClass: "text-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/20",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-900/20", 
    buttonVariant: "destructive" as const,
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    buttonVariant: "default" as const,
  },
};

export function DeleteModal({
  open,
  onOpenChange,
  title = "Are you absolutely sure?",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  itemName,
}: DeleteModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const defaultDescription = itemName
    ? `This action cannot be undone. This will permanently delete "${itemName}" and remove it from our servers.`
    : "This action cannot be undone. This will permanently delete this item and remove it from our servers.";

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Error handling can be customized by the parent component
      console.error("Delete operation failed:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-amber-700 border-2">
        <AlertDialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${config.iconBg}`}>
              <Icon className={`h-6 w-6 ${config.iconClass}`} />
            </div>
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-center">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground mt-2 text-center">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
          <AlertDialogCancel 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={config.buttonVariant}
              onClick={handleConfirm}
              disabled={loading}
              className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Icon className="h-4 w-4" />
                  {confirmText}
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}