export class ProductGridListItem {
    constructor(
        public id: number,
        public pgRow: number,
        public pgRowSlot: number,
        public pgMask: string,
        public pgContentId: number,
        public pgContentName: string,
        public pgContentType: string,
        public pgContentShow: string
    ) {}
  }
