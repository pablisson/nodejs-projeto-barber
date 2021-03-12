/**
 * ROTA: Recebe a requisição, chama outro arquivo, devolve uma resposta
 */
import { response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { startOfHour, parseISO } from  'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;
    const parsedDate = parseISO(date);
    
    const createAppointment = new CreateAppointmentService();
    const appointment = await createAppointment.execute({ date: parsedDate, provider_id });

    return response.json(appointment);

  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter; 