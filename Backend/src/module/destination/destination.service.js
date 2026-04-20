import destinationModel from '../../../db/models/destination.model.js';

export const createDestination = async (data) => {
    return await destinationModel.create(data);
};

export const getAllDestinations = async () => {
    return await destinationModel.find();
};

export const getDestinationById = async (id) => {
    const destination = await destinationModel.findById(id);
    if (!destination) throw new Error("Destination not found");
    return destination;
};

// 
export const updateDestination = async (id, updateData) => {
    return await destinationModel.findByIdAndUpdate(id, updateData, { new: true });
};

// admin only
export const deleteDestination = async (id) => {
    return await destinationModel.findByIdAndDelete(id);
};