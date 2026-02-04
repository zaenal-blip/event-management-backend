export class EventController {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    getEvents = async (req, res) => {
        const query = {
            page: Number(req.query.page) || 1,
            take: Number(req.query.take) || 10,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
            search: req.query.search,
            category: req.query.category,
            location: req.query.location,
            priceRange: req.query.priceRange,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };
        const result = await this.eventService.getEvents(query);
        res.status(200).send(result);
    };
    getEventById = async (req, res) => {
        const id = Number(req.params.id);
        const result = await this.eventService.getEventById(id);
        res.status(200).send(result);
    };
    createEvent = async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const result = await this.eventService.createEvent(req.user.id, req.body);
        res.status(201).send(result);
    };
    createVoucher = async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const eventId = Number(req.params.eventId);
        const result = await this.eventService.createVoucher(eventId, req.user.id, req.body);
        res.status(201).send(result);
    };
    publishEvent = async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const eventId = Number(req.params.id);
        const result = await this.eventService.publishEvent(eventId, req.user.id);
        res.status(200).send(result);
    };
}
