import * as providerService from './provider.service.js';

export const createProvider = async (req, res) => {
  try {
    const provider = await providerService.createProvider(req.body);
    return res.status(201).json({ message: "Provider created", provider });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllProviders = async (req, res) => {
  const result = await providerService.getAllProviders(req.query);
  return res.status(200).json({ message: "Providers retrieved", ...result });
};

export const getProvider = async (req, res) => {
  try {
    const provider = await providerService.getProviderById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    return res.status(200).json({ message: "Provider retrieved", provider });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const provider = await providerService.updateProvider(req.params.id, req.body);
    return res.status(200).json({ message: "Provider updated", provider });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    await providerService.deleteProvider(req.params.id);
    return res.status(200).json({ message: "Provider deleted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};