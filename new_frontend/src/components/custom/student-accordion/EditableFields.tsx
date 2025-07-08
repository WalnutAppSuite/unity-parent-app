import EditableField from '@/components/custom/editable-field';

export function EditableFields({ fields, editValues, setEditValues, handleOtpRequest }: {
    fields: { label: string, field: string }[];
    editValues: Record<string, string>;
    setEditValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleOtpRequest: (field: string, value: string) => Promise<boolean>;
}) {
    return (
        <>
            {fields.map(({ label, field }) => (
                <EditableField
                    key={field}
                    label={label}
                    value={editValues[field] || ''}
                    fieldName={field}
                    onChange={(val: string) => setEditValues(prev => ({ ...prev, [field]: val }))}
                    onUpdate={async (field: string, value: string, _otp: string) => {
                        await handleOtpRequest(field, value);
                    }}
                />
            ))}
        </>
    );
} 