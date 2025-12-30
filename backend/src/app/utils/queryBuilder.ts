import { Query } from 'mongoose';
import { excludeField } from '../constants';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  dateRange(dateField: string): this {
    const { startDate, endDate } = this.query;
    const isDateOnly = (s?: string) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

    // Use local time for start and end of day
    const mkStart = (s: string) => {
      if (isDateOnly(s)) {
        const [year, month, day] = s.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // UTC
      }
      return new Date(s);
    };
    const mkEnd = (s: string) => {
      if (isDateOnly(s)) {
        const [year, month, day] = s.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)); // UTC
      }
      return new Date(s);
    };

    if (startDate && endDate) {
      const start = mkStart(startDate);
      const end = mkEnd(endDate);
      this.modelQuery = this.modelQuery.find({
        [dateField]: { $gte: start, $lte: end },
      });
      return this;
    }

    // If only startDate is provided, set endDate to today (end of day)
    if (startDate && !endDate) {
      const start = mkStart(startDate);
      const today = new Date();
      const end = new Date(
        Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999
        )
      );
      this.modelQuery = this.modelQuery.find({
        [dateField]: { $gte: start, $lte: end },
      });
      return this;
    }
    if (!startDate && endDate) {
      const end = mkEnd(endDate);
      // eslint-disable-next-line no-console
      console.log('[QueryBuilder.dateRange]', { endDate, end });
      this.modelQuery = this.modelQuery.find({ [dateField]: { $lte: end } });
      return this;
    }
    return this;
  }

  filter(): this {
    const filter = { ...this.query };
    for (const field of excludeField) {
      delete filter[field];
    }
    // Remove 'role' and 'status' if value is 'all'
    if (filter.role === 'all') delete filter.role;
    if (filter.status === 'all') delete filter.status;
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchFields: string[]): this {
    const searchTerm = this.query.searchTerm || '';
    if (searchTerm) {
      const searchQuery = {
        $or: searchFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      };
      this.modelQuery = this.modelQuery.find(searchQuery);
    }
    return this;
  }

  sort(): this {
    const sort = this.query.sort || '-createdAt';
    // eslint-disable-next-line no-console
    console.log('[QueryBuilder.sort]', sort);
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(',').join(' ') || '';
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const q = this.modelQuery;

    const filter = q.getFilter();
    const totalDocuments = await q.model.countDocuments(filter);

    const rawPage = Number(this.query.page);
    const rawLimit = Number(this.query.limit);
    const page =
      Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0
        ? Math.min(Math.floor(rawLimit), 100)
        : 10;

    const totalPage = Math.max(1, Math.ceil((totalDocuments || 0) / limit));

    return { page, limit, total: totalDocuments, totalPage };
  }
}
