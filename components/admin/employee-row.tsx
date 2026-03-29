import { Badge } from "@/components/(shared)/ui/badge";
import { Button } from "@/components/(shared)/ui/button";

type Employee = {
  id: number;
  name: string;
  email: string;
  username: string;
  startDate?: string | null;
  position?: string | null;
  gender?: string | null;
};

type EmployeeRowProps = {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
};

export default function EmployeeRow({
  employee,
  onEdit,
  onDelete,
}: EmployeeRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900">
      <div>
        <p className="font-semibold text-brand-950">{employee.name}</p>
        <p className="text-xs text-brand-700">
          @{employee.username} · {employee.email}
        </p>
        <p className="text-xs text-brand-600">
          {employee.position ? employee.position : "Jabatan belum diisi"}
          {employee.startDate
            ? ` · Masuk ${new Date(employee.startDate).toLocaleDateString("id-ID")}`
            : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge>
          {employee.gender === "L"
            ? "Laki-laki"
            : employee.gender === "P"
            ? "Perempuan"
            : "-"}
        </Badge>
        <Button variant="secondary" onClick={() => onEdit(employee)}>
          Edit
        </Button>
        <Button variant="ghost" onClick={() => onDelete(employee)}>
          Hapus
        </Button>
      </div>
    </div>
  );
}
