export function ReadOnlyFields({ fields }: { fields: { label: string, value: string }[] }) {
    return (
        <div className='tw-flex tw-gap-1 tw-flex-col'>
            {fields.map(({ label, value }, idx) => (
                <div className='tw-flex tw-gap-1 tw-flex-col' key={idx}>
                    <label className='tw-w-fit'>{label}</label>
                    <input type="text" value={value || 'N/A'} className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1' readOnly />
                </div>
            ))}
        </div>
    );
} 