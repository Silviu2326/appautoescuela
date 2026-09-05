import {initialPack} from '../src/data/catalog.ts';
import {validatePack} from '../src/engine/content.ts';
validatePack(initialPack);console.log(`${initialPack.questions.length} preguntas, ${initialPack.concepts.length} conceptos y ${initialPack.scenes.length} escenas válidos. Revisión profesional pendiente.`);
