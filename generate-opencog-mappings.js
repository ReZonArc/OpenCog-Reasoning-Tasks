import fs from 'fs';
import path from 'path';

// OpenCog subsystem mappings based on task characteristics
const OPENCOG_MAPPINGS = {
    // Logic-based reasoning tasks
    'syllogism-reasoning': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Deductive Logic',
        complexity_level: 'Medium'
    },
    'deductive-logic-puzzles': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace', 'Attention Allocation (ECAN)'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Hierarchical Processing',
        reasoning_type: 'Deductive Logic',
        complexity_level: 'High'
    },
    'identifying-logical-fallacies': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Pattern Matcher'],
        secondary_subsystems: ['Natural Language Processing (RelEx)', 'AtomSpace'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Logical Analysis',
        complexity_level: 'Medium'
    },
    'identifying-logical-inconsistencies': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Parallel Processing',
        reasoning_type: 'Consistency Checking',
        complexity_level: 'Medium'
    },
    'truth-table-completion': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Boolean Logic',
        complexity_level: 'Low'
    },
    'constructing-valid-arguments': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Natural Language Processing (RelEx)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Argumentative Logic',
        complexity_level: 'High'
    },

    // Pattern recognition and analysis
    'deducing-rules-from-examples': {
        primary_subsystems: ['Learning and Memory', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace', 'PLN (Probabilistic Logic Networks)'],
        cognitive_architecture: 'Sub-symbolic Processing',
        integration_pattern: 'Iterative Processing',
        reasoning_type: 'Inductive Learning',
        complexity_level: 'High'
    },
    'recognizing-patterns-in-sequences': {
        primary_subsystems: ['Pattern Matcher', 'Learning and Memory'],
        secondary_subsystems: ['AtomSpace', 'Attention Allocation (ECAN)'],
        cognitive_architecture: 'Sub-symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Pattern Recognition',
        complexity_level: 'Medium'
    },
    'pattern-recognition-in-spatial-arrangements': {
        primary_subsystems: ['Pattern Matcher', 'Perception and Sensory Processing'],
        secondary_subsystems: ['AtomSpace', 'Learning and Memory'],
        cognitive_architecture: 'Sub-symbolic Processing',
        integration_pattern: 'Parallel Processing',
        reasoning_type: 'Spatial Pattern Recognition',
        complexity_level: 'High'
    },

    // Analogical reasoning
    'analogical-problem-solving': {
        primary_subsystems: ['Pattern Matcher', 'PLN (Probabilistic Logic Networks)'],
        secondary_subsystems: ['AtomSpace', 'Learning and Memory'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Hierarchical Processing',
        reasoning_type: 'Analogical Reasoning',
        complexity_level: 'High'
    },
    'analogy-creation': {
        primary_subsystems: ['Pattern Matcher', 'Natural Language Processing (RelEx)'],
        secondary_subsystems: ['AtomSpace', 'Learning and Memory'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Analogical Generation',
        complexity_level: 'High'
    },
    'completing-analogies': {
        primary_subsystems: ['Pattern Matcher', 'PLN (Probabilistic Logic Networks)'],
        secondary_subsystems: ['AtomSpace'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Analogical Completion',
        complexity_level: 'Medium'
    },

    // Causal reasoning
    'causal-chain-analysis': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace', 'Learning and Memory'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Causal Reasoning',
        complexity_level: 'High'
    },
    'identifying-cause-and-effect-relationships': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace', 'Natural Language Processing (RelEx)'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Causal Analysis',
        complexity_level: 'Medium'
    },
    'distinguishing-correlation-from-causation': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Learning and Memory'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Statistical Reasoning',
        complexity_level: 'High'
    },

    // Spatial reasoning
    'spatial-problem-solving': {
        primary_subsystems: ['Perception and Sensory Processing', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace', 'PLN (Probabilistic Logic Networks)'],
        cognitive_architecture: 'Sub-symbolic Processing',
        integration_pattern: 'Parallel Processing',
        reasoning_type: 'Spatial Reasoning',
        complexity_level: 'High'
    },
    'describing-spatial-relationships': {
        primary_subsystems: ['Perception and Sensory Processing', 'Natural Language Processing (RelEx)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Spatial Description',
        complexity_level: 'Medium'
    },
    'mental-rotation-tasks': {
        primary_subsystems: ['Perception and Sensory Processing', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace'],
        cognitive_architecture: 'Sub-symbolic Processing',
        integration_pattern: 'Parallel Processing',
        reasoning_type: 'Spatial Transformation',
        complexity_level: 'Medium'
    },

    // Theory of mind and social reasoning
    'first-order-false-belief': {
        primary_subsystems: ['Cognition Engine (OpenPsi)', 'PLN (Probabilistic Logic Networks)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Meta-cognitive Processing',
        integration_pattern: 'Hierarchical Processing',
        reasoning_type: 'Theory of Mind',
        complexity_level: 'High'
    },
    'second-order-false-belief': {
        primary_subsystems: ['Cognition Engine (OpenPsi)', 'PLN (Probabilistic Logic Networks)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher', 'Attention Allocation (ECAN)'],
        cognitive_architecture: 'Meta-cognitive Processing',
        integration_pattern: 'Hierarchical Processing',
        reasoning_type: 'Higher-Order Theory of Mind',
        complexity_level: 'Very High'
    },
    'perspective-taking-in-social-scenarios': {
        primary_subsystems: ['Cognition Engine (OpenPsi)', 'Natural Language Processing (RelEx)'],
        secondary_subsystems: ['AtomSpace', 'PLN (Probabilistic Logic Networks)'],
        cognitive_architecture: 'Meta-cognitive Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Social Perspective Taking',
        complexity_level: 'High'
    },

    // Language and communication
    'interpreting-ambiguous-statements': {
        primary_subsystems: ['Natural Language Processing (RelEx)', 'PLN (Probabilistic Logic Networks)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Language Understanding',
        complexity_level: 'High'
    },
    'detecting-sarcasm-and-irony': {
        primary_subsystems: ['Natural Language Processing (RelEx)', 'Cognition Engine (OpenPsi)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Parallel Processing',
        reasoning_type: 'Pragmatic Language Understanding',
        complexity_level: 'High'
    },
    'parsing-complex-sentences': {
        primary_subsystems: ['Natural Language Processing (RelEx)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Syntactic Analysis',
        complexity_level: 'Medium'
    },

    // Mathematical reasoning
    'mathematical-word-problems': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Natural Language Processing (RelEx)'],
        secondary_subsystems: ['AtomSpace', 'Pattern Matcher'],
        cognitive_architecture: 'Hybrid Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Mathematical Reasoning',
        complexity_level: 'High'
    },
    'equation-derivation': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Pattern Matcher'],
        secondary_subsystems: ['AtomSpace', 'Learning and Memory'],
        cognitive_architecture: 'Symbolic Processing',
        integration_pattern: 'Sequential Processing',
        reasoning_type: 'Mathematical Derivation',
        complexity_level: 'High'
    },
    'fermi-estimation': {
        primary_subsystems: ['PLN (Probabilistic Logic Networks)', 'Learning and Memory'],
        secondary_subsystems: ['AtomSpace', 'Attention Allocation (ECAN)'],
        cognitive_architecture: 'Sub-symbolic Processing',
        integration_pattern: 'Iterative Processing',
        reasoning_type: 'Approximate Reasoning',
        complexity_level: 'High'
    }
};

// Default mapping for tasks not specifically defined
const DEFAULT_MAPPING = {
    primary_subsystems: ['AtomSpace', 'PLN (Probabilistic Logic Networks)'],
    secondary_subsystems: ['Pattern Matcher'],
    cognitive_architecture: 'Hybrid Processing',
    integration_pattern: 'Sequential Processing',
    reasoning_type: 'General Reasoning',
    complexity_level: 'Medium'
};

function generateOpenCogMapping(taskName) {
    // Remove file extension if present
    const cleanTaskName = taskName.replace('.json', '').replace('.md', '');
    
    // Return specific mapping if available, otherwise use default
    return OPENCOG_MAPPINGS[cleanTaskName] || DEFAULT_MAPPING;
}

// Function to update all task JSON files with OpenCog mappings
function updateTasksWithOpenCogMappings() {
    const tasksJsonDir = './tasks-json';
    
    if (!fs.existsSync(tasksJsonDir)) {
        console.log('tasks-json directory not found');
        return;
    }

    const jsonFiles = fs.readdirSync(tasksJsonDir).filter(file => file.endsWith('.json'));
    
    console.log(`Processing ${jsonFiles.length} task files...`);

    jsonFiles.forEach(file => {
        const filePath = path.join(tasksJsonDir, file);
        const taskName = file.replace('.json', '');
        
        try {
            const taskData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // Add or update OpenCog mapping
            taskData.opencog_mapping = generateOpenCogMapping(taskName);
            
            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(taskData, null, 4));
            
            console.log(`✓ Updated OpenCog mapping for: ${taskName}`);
        } catch (error) {
            console.log(`✗ Error processing ${taskName}: ${error.message}`);
        }
    });
    
    console.log('OpenCog mapping update complete!');
}

// Run the mapping update
updateTasksWithOpenCogMappings();

export { generateOpenCogMapping, OPENCOG_MAPPINGS };