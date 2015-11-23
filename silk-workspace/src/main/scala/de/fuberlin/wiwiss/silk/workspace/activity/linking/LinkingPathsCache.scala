package de.fuberlin.wiwiss.silk.workspace.activity.linking

import de.fuberlin.wiwiss.silk.config.LinkSpecification
import de.fuberlin.wiwiss.silk.dataset.Dataset
import de.fuberlin.wiwiss.silk.entity.rdf.SparqlEntitySchema
import de.fuberlin.wiwiss.silk.runtime.activity.{Activity, ActivityContext}
import de.fuberlin.wiwiss.silk.util.DPair

/**
 * Holds the most frequent paths.
 */
class LinkingPathsCache(datasets: DPair[Dataset], linkSpec: LinkSpecification) extends Activity[DPair[SparqlEntitySchema]] {

  /**
   * Loads the most frequent property paths.
   */
  override def run(context: ActivityContext[DPair[SparqlEntitySchema]]) = {
    context.status.update("Retrieving frequent property paths", 0.0)

    //Create an entity description from the link specification
    val currentEntityDescs = linkSpec.entityDescriptions

    //Check if the restriction has been changed
    val update =
      context.value() == null ||
        (currentEntityDescs.source.restrictions != context.value().source.restrictions &&
         currentEntityDescs.target.restrictions != context.value().target.restrictions)

    if (update) {
      // Retrieve the data sources
      val sources = datasets.map(_.source)
      //Retrieve most frequent paths
      val paths = for ((source, dataset) <- sources zip linkSpec.dataSelections) yield source.retrieveSparqlPaths(dataset.restriction, 1, Some(50))
      //Add the frequent paths to the entity description
      context.value() = for ((entityDesc, paths) <- currentEntityDescs zip paths) yield entityDesc.copy(paths = (entityDesc.paths ++ paths.map(_._1)).distinct)
    }
  }
}