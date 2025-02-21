export class MotorcycleIssue {
    constructor(
        public id: number,
        public code: string,
        public issueDescription: string,
        public possibleCauses: string,
        public solutionSuggestion: string,
        public severityLevel: number,
        public active: boolean,
        public changedActive: boolean = false,
        public keyword?: string,

    ) { }
}