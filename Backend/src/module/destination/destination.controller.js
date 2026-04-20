import * as destinationService from './destination.service.js';

// إضافة وجهة (Admin Only)
export const addDestination = async (req, res) => {
    try {
        const destination = await destinationService.createDestination(req.body);
        return res.status(201).json({ message: "Added by Admin", destination });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// عرض الكل (لليوزرز والأدمن)
export const getDestinations = async (req, res) => {
    const destinations = await destinationService.getAllDestinations();
    return res.status(200).json({ message: "Done", destinations });
};

// عرض واحدة (لليوزرز والأدمن)
export const getOneDestination = async (req, res) => {
    try {
        const destination = await destinationService.getDestinationById(req.params.destinationId);
        return res.status(200).json({ message: "Done", destination });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

// تحديث (Admin Only)
export const updateDestination = async (req, res) => {
    try {
        const result = await destinationService.updateDestination(req.params.destinationId, req.body);
        return res.status(200).json({ message: "Updated by Admin", result });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// حذف (Admin Only)
export const removeDestination = async (req, res) => {
    try {
        await destinationService.deleteDestination(req.params.destinationId);
        return res.status(200).json({ message: "Deleted by Admin" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};