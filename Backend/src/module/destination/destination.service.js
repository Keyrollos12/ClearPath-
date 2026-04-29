import { Destination } from '../../db/models/destination.model.js';

export const createDestination = async (data) => {
    return await Destination.create(data);
};

export const getAllDestinations = async () => {
    return await Destination.find();
};

export const getDestinationById = async (id) => {
    const destination = await Destination.findById(id);
    if (!destination) throw new Error("Destination not found");
    return destination;
};

export const updateDestination = async (id, updateData) => {
    return await Destination.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteDestination = async (id) => {
    return await Destination.findByIdAndDelete(id);
};
