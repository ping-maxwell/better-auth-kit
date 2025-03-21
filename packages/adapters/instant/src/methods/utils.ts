export const transformOutput = ({
	data,
	model,
	select = [],
}: {
	data: Record<string, any>;
	model: string;
	select: string[];
}) => {
	if (!data) return null;
	const transformedData: Record<string, any> =
		data.id || data._id
			? select.length === 0 || select.includes("id")
				? {
						id: data.id,
					}
				: {}
			: {};
	const tableSchema = schema[model].fields;
	for (const key in tableSchema) {
		if (select.length && !select.includes(key)) {
			continue;
		}
		const field = tableSchema[key];
		if (field) {
			transformedData[key] = data[field.fieldName || key];
		}
	}
	return transformedData as any;
};
